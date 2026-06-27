import { useState, useEffect } from "react";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, Trash2, ShieldCheck } from "lucide-react";

const inviteSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email").max(255),
});

interface AdminRow {
  user_id: string;
  name: string | null;
  email: string;
}

const AdminsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Fetch current user once
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setCurrentUserId(data.user?.id ?? null);
    });
  }, []);

  const { data: admins = [], isLoading } = useQuery({
    queryKey: ["admin_admins"],
    queryFn: async (): Promise<AdminRow[]> => {
      const { data: roles, error } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (error) throw error;
      const ids = (roles ?? []).map((r) => r.user_id);
      if (ids.length === 0) return [];
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, name, email")
        .in("id", ids);
      if (pErr) throw pErr;
      return (profiles ?? []).map((p) => ({
        user_id: p.id,
        name: p.name,
        email: p.email,
      }));
    },
  });

  const invite = useMutation({
    mutationFn: async () => {
      const parsed = inviteSchema.safeParse({ name, email });
      if (!parsed.success) {
        throw new Error(parsed.error.issues[0]?.message ?? "Invalid input");
      }
      const { data, error } = await supabase.functions.invoke("invite-admin", {
        body: parsed.data,
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: data?.invited ? "Invite sent" : "Admin added",
        description: data?.invited
          ? `An invitation email has been sent to ${email}.`
          : `${email} already had an account and was granted admin access.`,
      });
      setName("");
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["admin_admins"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to invite admin",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const remove = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.functions.invoke("remove-admin", {
        body: { user_id: userId },
      });
      if (error) throw new Error(error.message);
      if (data?.error) throw new Error(data.error);
    },
    onSuccess: () => {
      toast({ title: "Admin access removed" });
      queryClient.invalidateQueries({ queryKey: ["admin_admins"] });
    },
    onError: (err: Error) => {
      toast({
        title: "Failed to remove admin",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail className="h-5 w-5" /> Invite a new admin
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              invite.mutate();
            }}
            className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"
          >
            <div className="space-y-2">
              <Label htmlFor="admin-name">Name</Label>
              <Input
                id="admin-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Smith"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                maxLength={255}
                required
              />
            </div>
            <Button type="submit" disabled={invite.isPending}>
              {invite.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send invite"
              )}
            </Button>
          </form>
          <p className="text-sm text-muted-foreground mt-3">
            They will receive an email with a link to set their password and
            access the admin dashboard.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" /> Current admins
          </h3>
          {isLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : admins.length === 0 ? (
            <p className="text-sm text-muted-foreground">No admins yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {admins.map((a) => (
                <li
                  key={a.user_id}
                  className="flex items-center justify-between py-3"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {a.name || "(no name)"}
                      {a.user_id === currentUserId && (
                        <span className="ml-2 text-xs text-muted-foreground">
                          (you)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-muted-foreground">{a.email}</p>
                  </div>
                  {a.user_id !== currentUserId && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remove admin access?</AlertDialogTitle>
                          <AlertDialogDescription>
                            {a.email} will no longer be able to access the
                            admin dashboard. Their account is preserved.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => remove.mutate(a.user_id)}
                          >
                            Remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminsTab;