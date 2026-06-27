import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, TrendingUp, ArrowRight, Calendar, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const HomePage = () => {
  return (
    <Layout>
      <SEO title="Home" description="Join Grampians Hockey Club in the Grampians region. Division 2 hockey for all skill levels in Hockey Ballarat. Play, volunteer, support." />
      {/* Hero Section */}
      <section className="relative text-primary-foreground overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/hero-banner.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-hero-gradient opacity-60" />
        
        <div className="container relative px-4 md:px-6 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm">
              <span className="animate-pulse w-2 h-2 bg-gold rounded-full" />
              <span>Division 2 • Hockey Ballarat</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Grampians Hockey
              <span className="block text-gold mt-2">Club</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-primary-foreground/90 font-light">
              Play. Volunteer. Support.
            </p>
            
            <p className="text-lg text-primary-foreground/80 max-w-xl mx-auto">
              Join our friendly community of hockey players in the heart of the Grampians region. 
              Whether you're a seasoned player or just starting out, there's a place for you here.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light">
                <Link to="/join">
                  Join the Club
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Mountain silhouette decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{
          clipPath: "polygon(0 100%, 100% 100%, 100% 0, 85% 60%, 70% 20%, 55% 70%, 40% 30%, 25% 80%, 10% 40%, 0 100%)"
        }} />
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Club Values
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">At the heart of Grampians Hockey, we believe in building more than just a hockey team.

            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-primary/20">
              <CardContent className="pt-8 pb-6 px-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Users className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Community</h3>
                <p className="text-muted-foreground">
                  We're more than a club – we're a family. Connect with like-minded people who share your passion for hockey and the outdoors.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-secondary/20">
              <CardContent className="pt-8 pb-6 px-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                  <Heart className="h-7 w-7 text-secondary group-hover:text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Inclusion</h3>
                <p className="text-muted-foreground">
                  Everyone is welcome here. No matter your skill level, age, or background, you'll find a supportive environment to grow.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-accent/20">
              <CardContent className="pt-8 pb-6 px-6 text-center space-y-4">
                <div className="mx-auto w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                  <TrendingUp className="h-7 w-7 text-accent group-hover:text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">Growth</h3>
                <p className="text-muted-foreground">
                  We're committed to developing players at every level, from beginners finding their feet to experienced athletes honing their skills.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Info Section */}
      <section className="py-16 bg-section-alt">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Ready to Play?
              </h2>
              <p className="text-lg text-muted-foreground">
                Whether you're interested in playing, volunteering, or supporting the club, 
                we'd love to hear from you. Get in touch and become part of our growing community.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Barkley St, Ararat & Prince of Wales Park, Ballarat</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Training: Wednesday - 6:30pm - Prince of Wales Park, Ballarat</span>
                </div>
              </div>
              <Button asChild size="lg" className="mt-4">
                <Link to="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <div className="aspect-video rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/logo.png"
                  alt="Grampians Hockey Logo"
                  className="h-64 w-64 object-contain" />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* News Preview Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Latest News
              </h2>
              <p className="text-muted-foreground">Stay up to date with club announcements and events</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/news">
                View All News
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-primary/30 to-primary/10" />
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-2">January 2026</p>
                <h3 className="font-semibold text-lg text-foreground mb-2">Season 2026 Registration Open</h3>
                <p className="text-sm text-muted-foreground">
                  Registration for the 2026 season is now open. Join us for another great year of hockey!
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-secondary/30 to-secondary/10" />
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-2">December 2025</p>
                <h3 className="font-semibold text-lg text-foreground mb-2">End of Season Celebration</h3>
                <p className="text-sm text-muted-foreground">
                  What a fantastic season! Thank you to all players, volunteers, and supporters.
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-accent/30 to-accent/10" />
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground mb-2">November 2025</p>
                <h3 className="font-semibold text-lg text-foreground mb-2">New Training Equipment</h3>
                <p className="text-sm text-muted-foreground">
                  Thanks to club fundraising, we've upgraded our training equipment for the new season.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-hero-gradient text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Become a Grampians Hockey Player
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Join our Division 2 team and be part of the growing hockey community in the Grampians region.
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

export default HomePage;