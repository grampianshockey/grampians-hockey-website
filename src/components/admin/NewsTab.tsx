import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Pencil, X, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const NewsTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", category: "", excerpt: "", is_published: true });

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin_news"],
    queryFn: async () => {
      const { data, error } = await supabase.from("news_articles").select("*").order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upsert = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from("news_articles").update(form).eq("id", editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("news_articles").insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_news"] });
      queryClient.invalidateQueries({ queryKey: ["news_articles"] });
      setEditing(null);
      setCreating(false);
      setForm({ title: "", date: "", category: "", excerpt: "", is_published: true });
      toast({ title: editing ? "Article updated" : "Article created" });
    },
    onError: () => toast({ title: "Error", description: "Something went wrong", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("news_articles").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_news"] });
      queryClient.invalidateQueries({ queryKey: ["news_articles"] });
      toast({ title: "Article deleted" });
    },
    onError: () => toast({ title: "Error", description: "Something went wrong", variant: "destructive" }),
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, is_published }: { id: string; is_published: boolean }) => {
      const { error } = await supabase.from("news_articles").update({ is_published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_news"] });
      queryClient.invalidateQueries({ queryKey: ["news_articles"] });
    },
  });

  const startEdit = (article: any) => {
    setEditing(article.id);
    setCreating(false);
    setForm({ title: article.title, date: article.date, category: article.category, excerpt: article.excerpt, is_published: article.is_published });
  };

  const showForm = creating || editing;

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-foreground">News Articles ({articles.length})</h3>
        {!showForm && (
          <Button onClick={() => { setCreating(true); setEditing(null); setForm({ title: "", date: format(new Date(), "yyyy-MM-dd"), category: "", excerpt: "", is_published: true }); }}>
            <Plus className="h-4 w-4 mr-2" /> Add Article
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-foreground">{editing ? "Edit Article" : "New Article"}</h4>
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
            <div className="space-y-2">
              <Label>Category</Label>
              <Input value={form.category} onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Club News, Events, Match Report" required />
            </div>
            <div className="space-y-2">
              <Label>Excerpt</Label>
              <Textarea value={form.excerpt} onChange={(e) => setForm(f => ({ ...f, excerpt: e.target.value }))} rows={3} required />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.is_published} onCheckedChange={(v) => setForm(f => ({ ...f, is_published: v }))} />
              <Label>Published</Label>
            </div>
            <Button onClick={() => upsert.mutate()} disabled={!form.title || !form.date || !form.category || !form.excerpt || upsert.isPending}>
              {upsert.isPending ? "Saving..." : editing ? "Update" : "Create"}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {articles.length === 0 && (
          <p className="text-muted-foreground text-center py-8">No articles yet. Click "Add Article" to create your first one.</p>
        )}
        {articles.map((article) => (
          <Card key={article.id} className={!article.is_published ? "opacity-60" : ""}>
            <CardContent className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{article.title}</p>
                <p className="text-sm text-muted-foreground">{article.category} • {format(new Date(article.date), "d MMM yyyy")}</p>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{article.excerpt}</p>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={article.is_published} onCheckedChange={(v) => togglePublish.mutate({ id: article.id, is_published: v })} />
                <Button variant="ghost" size="icon" onClick={() => startEdit(article)}><Pencil className="h-4 w-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Article</AlertDialogTitle>
                      <AlertDialogDescription>Are you sure you want to delete "{article.title}"? This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(article.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
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

export default NewsTab;
