import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, LogOut } from "lucide-react";
import Layout from "@/components/Layout";
import SubmissionsTab from "@/components/admin/SubmissionsTab";
import NewsTab from "@/components/admin/NewsTab";
import EventsTab from "@/components/admin/EventsTab";
import TeamTab from "@/components/admin/TeamTab";
import CommitteeTab from "@/components/admin/CommitteeTab";
import GalleryTab from "@/components/admin/GalleryTab";
import AdminsTab from "@/components/admin/AdminsTab";

const AdminPage = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [roleChecked, setRoleChecked] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session?.user) {
          setRoleChecked(false);
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            const { data } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", session.user.id)
              .eq("role", "admin")
              .maybeSingle();
            setIsAdmin(!!data);
            setRoleChecked(true);
            setLoading(false);
          }, 0);
        } else {
          setIsAdmin(false);
          setRoleChecked(true);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) {
      toast({ title: "Login Failed", description: error.message, variant: "destructive" });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
      redirectTo: window.location.origin + "/admin",
    });
    setResetLoading(false);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Reset email sent", description: "Check your inbox for a password reset link." });
      setShowForgotPassword(false);
      setResetEmail("");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading || (session && !roleChecked)) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!session) {
    return (
      <Layout>
        <section className="bg-hero-gradient text-primary-foreground py-16">
          <div className="container px-4 md:px-6">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-3xl font-bold mb-2">Admin Login</h1>
              <p className="text-primary-foreground/80">Committee members only</p>
            </div>
          </div>
        </section>
        <section className="py-16 bg-background">
          <div className="container px-4 md:px-6">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                {showForgotPassword ? (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <h2 className="text-lg font-semibold text-foreground">Reset Password</h2>
                    <p className="text-sm text-muted-foreground">Enter your email and we'll send you a reset link.</p>
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email</Label>
                      <Input id="reset-email" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full" disabled={resetLoading}>
                      {resetLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                    <button type="button" className="text-sm text-primary underline hover:no-underline w-full text-center" onClick={() => setShowForgotPassword(false)}>
                      Back to login
                    </button>
                  </form>
                ) : (
                  <>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Username / Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                      <Button type="submit" className="w-full" disabled={authLoading}>
                        {authLoading ? "Logging in..." : "Log In"}
                      </Button>
                    </form>
                    <button type="button" className="text-sm text-primary underline hover:no-underline w-full text-center mt-4" onClick={() => setShowForgotPassword(true)}>
                      Forgot password?
                    </button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <section className="py-16 bg-background">
          <div className="container px-4 md:px-6 text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-6">Your account does not have admin access.</p>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="bg-hero-gradient text-primary-foreground py-8">
        <div className="container px-4 md:px-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-primary-foreground/80 text-sm">{session.user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="text-foreground bg-background border-border hover:bg-muted">
            <LogOut className="mr-2 h-4 w-4" /> Log Out
          </Button>
        </div>
      </section>

      <section className="py-8 bg-background">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="submissions">
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="news">News</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="team">Team Info</TabsTrigger>
              <TabsTrigger value="committee">Committee</TabsTrigger>
              <TabsTrigger value="gallery">Gallery</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
            <TabsContent value="submissions"><SubmissionsTab /></TabsContent>
            <TabsContent value="news"><NewsTab /></TabsContent>
            <TabsContent value="events"><EventsTab /></TabsContent>
            <TabsContent value="team"><TeamTab /></TabsContent>
            <TabsContent value="committee"><CommitteeTab /></TabsContent>
            <TabsContent value="gallery"><GalleryTab /></TabsContent>
            <TabsContent value="admins"><AdminsTab /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default AdminPage;
