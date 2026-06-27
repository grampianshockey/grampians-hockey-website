import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Mail, UserPlus, Check } from "lucide-react";
import { format } from "date-fns";

const SubmissionsTab = () => {
  const queryClient = useQueryClient();

  const { data: contactSubs = [], isLoading: contactLoading } = useQuery({
    queryKey: ["contact_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: joinSubs = [], isLoading: joinLoading } = useQuery({
    queryKey: ["join_submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("join_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markContactRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact_submissions"] }),
  });

  const markJoinRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("join_submissions").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["join_submissions"] }),
  });

  const unreadContact = contactSubs.filter(s => !s.is_read).length;
  const unreadJoin = joinSubs.filter(s => !s.is_read).length;

  return (
    <Tabs defaultValue="contact">
      <TabsList>
        <TabsTrigger value="contact" className="gap-2">
          <Mail className="h-4 w-4" /> Contact {unreadContact > 0 && <Badge variant="destructive" className="ml-1 text-xs">{unreadContact}</Badge>}
        </TabsTrigger>
        <TabsTrigger value="join" className="gap-2">
          <UserPlus className="h-4 w-4" /> Join {unreadJoin > 0 && <Badge variant="destructive" className="ml-1 text-xs">{unreadJoin}</Badge>}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="contact">
        {contactLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : contactSubs.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No contact submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {contactSubs.map((sub) => (
              <Card key={sub.id} className={sub.is_read ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{sub.name}</span>
                        {!sub.is_read && <Badge variant="default" className="text-xs">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{sub.email}</p>
                      <p className="text-sm font-medium text-foreground mt-2">{sub.subject}</p>
                      <p className="text-sm text-muted-foreground">{sub.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{format(new Date(sub.created_at), "PPp")}</p>
                    </div>
                    {!sub.is_read && (
                      <Button size="sm" variant="outline" onClick={() => markContactRead.mutate(sub.id)}>
                        <Check className="h-4 w-4 mr-1" /> Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="join">
        {joinLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : joinSubs.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No join submissions yet.</p>
        ) : (
          <div className="space-y-4">
            {joinSubs.map((sub) => (
              <Card key={sub.id} className={sub.is_read ? "opacity-60" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">{sub.name}</span>
                        {!sub.is_read && <Badge variant="default" className="text-xs">New</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{sub.email} {sub.phone && `• ${sub.phone}`}</p>
                      {sub.interest && <p className="text-sm text-foreground">Interest: {sub.interest}</p>}
                      {sub.experience && <p className="text-sm text-foreground">Experience: {sub.experience}</p>}
                      {sub.date_of_birth && <p className="text-sm text-muted-foreground">DOB: {format(new Date(sub.date_of_birth), "PP")}</p>}
                      {sub.message && <p className="text-sm text-muted-foreground mt-1">{sub.message}</p>}
                      <p className="text-xs text-muted-foreground mt-2">{format(new Date(sub.created_at), "PPp")}</p>
                    </div>
                    {!sub.is_read && (
                      <Button size="sm" variant="outline" onClick={() => markJoinRead.mutate(sub.id)}>
                        <Check className="h-4 w-4 mr-1" /> Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SubmissionsTab;
