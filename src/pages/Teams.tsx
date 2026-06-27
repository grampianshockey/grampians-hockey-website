import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, ArrowRight, Trophy, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import TeamGallery from "@/components/TeamGallery";

const TeamsPage = () => {
  const { data: teamInfo, isLoading } = useQuery({
    queryKey: ["team_info"],
    queryFn: async () => {
      const { data, error } = await supabase.
      from("team_info").
      select("*").
      maybeSingle();
      if (error) throw error;
      return data;
    }
  });

  const competition = teamInfo?.competition ?? "Division 2";
  const teamType = teamInfo?.team_type ?? "Open";
  const gameDay = teamInfo?.game_day ?? "Sunday";
  const venue = teamInfo?.venue ?? "Prince of Wales Park, Ballarat";
  const trainingArarat = teamInfo?.training_ararat ?? "TBA";
  const trainingBallarat = teamInfo?.training_ballarat ?? "TBA";
  const seasonYear = teamInfo?.season_year ?? "2026";

  return (
    <Layout>
      <SEO title="Our Team" description="Meet the team — Grampians Hockey Club's Open team competing in Division 2 of Hockey Ballarat. Training in Ararat and Ballarat." />
      {/* Hero Section */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Trophy className="h-4 w-4" />
              <span>{teamType} {competition} • Hockey Ballarat</span>
            </div>
            <img
              src="/images/pumas-team-logo.png"
              alt="Pumas Logo"
              className="mx-auto mb-6 max-w-[800px]" />

            
            <p className="text-xl text-primary-foreground/90">
              Grampians Hockey Club's team competing in Hockey Ballarat
            </p>
          </div>
        </div>
      </section>

      {/* Team Overview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          {isLoading ?
          <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div> :

          <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  About the Team
                </h2>
                <p className="text-lg text-muted-foreground">
                  We are an {teamType} team competing in {competition} of Hockey Ballarat.
                  We're a mix of experienced players and enthusiastic newcomers, all united by our love 
                  of the game and our commitment to fair play.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">{teamType} Team</h3>
                      <p className="text-sm text-muted-foreground">All skill levels welcome</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                    <Calendar className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Games: {gameDay}s in Ballarat</h3>
                      <p className="text-sm text-muted-foreground">Regular competition matches</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-card rounded-lg border">
                    <Clock className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Training: {trainingArarat === "TBA" && trainingBallarat === "TBA" ? "TBA" : "See below"}</h3>
                      <p className="text-sm text-muted-foreground">Barkley St, Ararat & Prince of Wales Park, Ballarat</p>
                    </div>
                  </div>
                </div>
                <Button asChild>
                  <Link to="/join">
                    Join the Team
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              {/* Season Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-primary" />
                    Season {seasonYear}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-8 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground mb-2">Fixtures & Results</p>
                    <p className="text-2xl font-bold text-foreground">Coming Soon</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Season fixtures will be announced by Hockey Ballarat
                    </p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Competition</span>
                      <span className="font-medium text-foreground">{competition}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Team Type</span>
                      <span className="font-medium text-foreground">{teamType}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Game Day</span>
                      <span className="font-medium text-foreground">{gameDay}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Venue</span>
                      <span className="font-medium text-foreground">{venue}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          }
        </div>
      </section>

      {/* Training Schedule */}
      <section className="py-16 bg-section-alt">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Training Schedule
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Barkley St, Ararat</h3>
                  <p className="text-2xl font-bold text-primary mb-1">{trainingArarat}</p>
                  <p className="text-muted-foreground">{trainingArarat === "TBA" ? "Details coming soon" : ""}</p>
                </CardContent>
              </Card>

              <Card className="border-2 border-secondary/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">Prince of Wales Park, Ballarat</h3>
                  <p className="text-2xl font-bold text-secondary mb-1">{trainingBallarat}</p>
                  <p className="text-muted-foreground">{trainingBallarat === "TBA" ? "Details coming soon" : ""}</p>
                </CardContent>
              </Card>
            </div>
            <p className="text-muted-foreground">
              Training times and locations will be confirmed before the season starts.
              <br />
              <Link to="/contact" className="text-primary hover:underline">Contact us</Link> to register your interest.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Gallery */}
      <TeamGallery />

      {/* Juniors Coming Soon */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container px-4 md:px-6">
          <Card className="max-w-2xl mx-auto border-2 border-dashed border-gold/40 bg-gold/5">
            <CardContent className="p-8 text-center">
              <div className="inline-flex items-center gap-2 bg-gold/20 px-3 py-1 rounded-full text-sm font-medium text-gold mb-4">
                <span className="animate-pulse w-2 h-2 bg-gold rounded-full" />
                Coming Soon
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Junior Hockey
              </h3>
              <p className="text-muted-foreground mb-4">
                We're excited to announce that junior teams are coming to Grampians Hockey Club 
                in the 2026-2027 season! Stay tuned for more details.
              </p>
              <Link
                to="/contact"
                className="text-primary hover:underline font-medium">

                Register your interest →
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hero-gradient text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Want to Play?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            We're always looking for new players to join Grampians Hockey. No experience necessary!
          </p>
          <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light">
            <Link to="/join">
              Register Your Interest
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>);

};

export default TeamsPage;