import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const EventsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", location: "", is_active: true });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ["admin_events"],
    queryFn: async () => {
      const { data, error } = await supabase.from("upcoming_events").select("*").order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      const payload = { ...form, time: form.time || null };
      if (editing) {
        const { error } = await supabase.from("upcoming_events").update(payload).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("upcoming_events").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_events"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming_events"] });
      setEditing(null);
      setCreating(false);
      setForm({ title: "", date: "", time: "", location: "", is_active: true });
      toast({ title: editing ? "Event updated" : "Event created" });
    },
    onError: () => toast({ title: "Error", description: "Something went wrong", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("upcoming_events").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_events"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming_events"] });
      toast({ title: "Event deleted" });
    },
    onError: () => toast({ title: "Error", description: "Something went wrong", variant: "destructive" }),
  });

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("upcoming_events").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_events"] });
      queryClient.invalidateQueries({ queryKey: ["upcoming_events"] });
    },
  });

  const startEdit = (event: any) => {
    setEditing(event.id);
    setCreating(false);
    setForm({ title: event.title, date: event.date, time: event.time || "", location: event.location, is_active: event.is_active });
  };

  const showForm = creating || editing;

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Events ({events.length})</h3>
        {!showForm && (
          <Button onClick={() => { setCreating(true); setEditing(null); setForm({ title: "", date: format(new Date(), "yyyy-MM-dd"), time: "", location: "", is_active: true }); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Event
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-foreground">{editing ? "Edit Event" : "New Event"}</h4>
              <Button variant="ghost" size="icon" onClick={() => { setCreating(false); setEditing(null); }}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={form.date} onChange={(e) => setForm(f => ({ ...f, date: e.target.value }))} required />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Time</Label>
                <Input value={form.time} onChange={(e) => setForm(f => ({ ...f, time: e.target.value }))} placeholder="e.g. 6:00 PM" />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={form.location} onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))} required />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_active} onCheckedChange={(v) => setForm(f => ({ ...f, is_active: v }))} />
              <Label>Active</Label>
            </div>
            <Button onClick={() => upsert.mutate()} disabled={!form.title || !form.date || !form.location || upsert.isPending}>
              {upsert.isPending ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {events.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No events yet. Click "Add Event" to create your first one.</p>
        )}
        {events.map((event) => (
          <Card key={event.id} className={!event.is_active ? "opacity-60" : ""}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{event.title}</p>
                <p className="text-sm text-muted-foreground">{format(new Date(event.date), "d MMM yyyy")} {event.time && `• ${event.time}`} • {event.location}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={event.is_active} onCheckedChange={(v) => toggleActive.mutate({ id: event.id, is_active: v })} />
                <Button variant="ghost" size="icon" onClick={() => startEdit(event)}><Pencil className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Event</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete "{event.title}"? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(event.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
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

export default EventsTab;
