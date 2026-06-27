import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InviteBody {
  name?: string;
  email?: string;
}

const isEmail = (s: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 255;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify caller is an admin
    const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsErr } = await userClient.auth
      .getClaims(token);
    if (claimsErr || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const callerId = claimsData.claims.sub as string;

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json().catch(() => ({}))) as InviteBody;
    const name = (body.name ?? "").trim();
    const email = (body.email ?? "").trim().toLowerCase();
    if (!name || name.length > 100 || !email || !isEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid name or email" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const origin = req.headers.get("origin") ?? "";
    const redirectTo = origin ? `${origin}/admin` : undefined;

    // Try to invite. If user exists, fall back to granting role on existing user.
    let userId: string | null = null;
    const { data: invited, error: inviteErr } = await admin.auth.admin
      .inviteUserByEmail(email, { data: { name }, redirectTo });

    if (inviteErr) {
      // Look up existing user by email
      const { data: list, error: listErr } = await admin.auth.admin.listUsers({
        page: 1,
        perPage: 200,
      });
      if (listErr) {
        return new Response(
          JSON.stringify({ error: inviteErr.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      const existing = list.users.find(
        (u) => (u.email ?? "").toLowerCase() === email,
      );
      if (!existing) {
        return new Response(
          JSON.stringify({ error: inviteErr.message }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      userId = existing.id;
    } else {
      userId = invited.user?.id ?? null;
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "No user id" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Ensure profile exists/updated
    await admin.from("profiles").upsert({
      id: userId,
      name,
      email,
    }, { onConflict: "id" });

    // Grant admin role (ignore duplicate)
    const { error: roleErr } = await admin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (roleErr && !`${roleErr.message}`.toLowerCase().includes("duplicate")) {
      return new Response(JSON.stringify({ error: roleErr.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ ok: true, user_id: userId, invited: !inviteErr }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});