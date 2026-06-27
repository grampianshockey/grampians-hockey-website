import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, ArrowRight, Clock, MapPin, Newspaper, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const colorCycle = [
  "from-primary/30 to-primary/10",
  "from-secondary/30 to-secondary/10",
  "from-accent/30 to-accent/10",
];

const NewsPage = () => {
  const { data: newsItems = [], isLoading: newsLoading } = useQuery({
    queryKey: ["news_articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .eq("is_published", true)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: upcomingEvents = [], isLoading: eventsLoading } = useQuery({
    queryKey: ["upcoming_events"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("upcoming_events")
        .select("*")
        .eq("is_active", true)
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <Layout>
      <SEO title="News & Events" description="Stay up to date with Grampians Hockey Club news, upcoming events, and match announcements." />
      {/* Hero Section */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <Newspaper className="h-4 w-4" />
              <span>Club Updates & Announcements</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">News & Events</h1>
            <p className="text-xl text-primary-foreground/90">
              Stay up to date with everything happening at Grampians Hockey
            </p>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-section-alt">
        <div className="container px-4 md:px-6">
          <div className="flex items-center gap-3 mb-8">
            <Calendar className="h-6 w-6 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Upcoming Events
            </h2>
          </div>

          {eventsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-primary">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">{format(new Date(event.date), "d MMMM yyyy")}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-foreground">{event.title}</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{event.time || "TBA"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Latest News
          </h2>

          {newsLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsItems.map((item, index) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className={`h-32 bg-gradient-to-br ${colorCycle[index % 3]}`} />
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {item.category}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(item.date), "d MMMM yyyy")}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {item.excerpt}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-section-alt">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Don't Miss an Update
            </h2>
            <p className="text-muted-foreground">
              Want to stay informed about club news, upcoming events, and match results? 
              Get in touch and we'll keep you in the loop.
            </p>
            <Button asChild>
              <Link to="/contact">
                Contact Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hero-gradient text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Be Part of the Story
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Join Grampians Hockey and create your own memories with our club.
          </p>
          <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light">
            <Link to="/join">
              Join Us Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default NewsPage;
