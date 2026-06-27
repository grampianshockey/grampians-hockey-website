import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, X, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CommitteeTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", role: "", display_order: 0 });

  const { data: members = [], isLoading } = useQuery({
    queryKey: ["admin_committee"],
    queryFn: async () => {
      const { data, error } = await supabase.from("committee_members").select("*").order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("committee_members").update(form).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("committee_members").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_committee"] });
      queryClient.invalidateQueries({ queryKey: ["committee_members"] });
      setEditing(null);
      setCreating(false);
      setForm({ name: "", role: "", display_order: 0 });
      toast({ title: editing ? "Member updated" : "Member added" });
    },
    onError: () => toast({ title: "Error", description: "Something went wrong", variant: "destructive" }),
  });

  const deleteMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("committee_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_committee"] });
      queryClient.invalidateQueries({ queryKey: ["committee_members"] });
      toast({ title: "Member removed" });
    },
    onError: () => toast({ title: "Error", description: "Something went wrong", variant: "destructive" }),
  });

  const startEdit = (member: any) => {
    setEditing(member.id);
    setCreating(false);
    setForm({ name: member.name, role: member.role, display_order: member.display_order });
  };

  const showForm = creating || editing;

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Committee Members ({members.length})</h3>
        {!showForm && (
          <Button onClick={() => { setCreating(true); setEditing(null); setForm({ name: "", role: "", display_order: members.length + 1 }); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Member
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-foreground">{editing ? "Edit Member" : "New Member"}</h4>
              <Button variant="ghost" size="icon" onClick={() => { setCreating(false); setEditing(null); }}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={form.role} onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))} placeholder="e.g. President" required />
              </div>
              <div className="space-y-2">
                <Label>Order</Label>
                <Input type="number" value={form.display_order} onChange={(e) => setForm(f => ({ ...f, display_order: parseInt(e.target.value) || 0 }))} />
              </div>
            </div>
            <Button onClick={() => upsert.mutate()} disabled={!form.name || !form.role || upsert.isPending}>
              {upsert.isPending ? "Saving..." : editing ? "Update" : "Add"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {members.map((member) => (
          <Card key={member.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role} • Order: {member.display_order}</p>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => startEdit(member)}><Pencil className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove Member</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to remove {member.name} from the committee? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMember.mutate(member.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Remove</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CommitteeTab;
