import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const TeamTab = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    competition: "", team_type: "", game_day: "", venue: "",
    training_ararat: "", training_ballarat: "", season_year: "",
  });

  const { data: teamInfo, isLoading } = useQuery({
    queryKey: ["admin_team_info"],
    queryFn: async () => {
      const { data, error } = await supabase.from("team_info").select("*").maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (teamInfo) {
      setForm({
        competition: teamInfo.competition,
        team_type: teamInfo.team_type,
        game_day: teamInfo.game_day,
        venue: teamInfo.venue,
        training_ararat: teamInfo.training_ararat,
        training_ballarat: teamInfo.training_ballarat,
        season_year: teamInfo.season_year,
      });
    }
  }, [teamInfo]);

  const update = useMutation({
    mutationFn: async () => {
      if (!teamInfo) return;
      const { error } = await supabase.from("team_info").update(form).eq("id", teamInfo.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin_team_info"] });
      queryClient.invalidateQueries({ queryKey: ["team_info"] });
      toast({ title: "Team info updated" });
    },
    onError: () => toast({ title: "Error", description: "Something went wrong", variant: "destructive" }),
  });

  if (isLoading) return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Team & Season Information</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Competition</Label>
            <Input value={form.competition} onChange={(e) => setForm(f => ({ ...f, competition: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Team Type</Label>
            <Input value={form.team_type} onChange={(e) => setForm(f => ({ ...f, team_type: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Game Day</Label>
            <Input value={form.game_day} onChange={(e) => setForm(f => ({ ...f, game_day: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Venue</Label>
            <Input value={form.venue} onChange={(e) => setForm(f => ({ ...f, venue: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Training - Ararat</Label>
            <Input value={form.training_ararat} onChange={(e) => setForm(f => ({ ...f, training_ararat: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Training - Ballarat</Label>
            <Input value={form.training_ballarat} onChange={(e) => setForm(f => ({ ...f, training_ballarat: e.target.value }))} />
          </div>
          <div className="space-y-2">
            <Label>Season Year</Label>
            <Input value={form.season_year} onChange={(e) => setForm(f => ({ ...f, season_year: e.target.value }))} />
          </div>
        </div>
        <Button onClick={() => update.mutate()} disabled={update.isPending}>
          {update.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamTab;
