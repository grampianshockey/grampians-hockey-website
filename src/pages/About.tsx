import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Heart, TrendingUp, MapPin, ArrowRight, Trophy, Target, Handshake } from "lucide-react";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const AboutPage = () => {
  return (
    <Layout>
      <SEO title="About Us" description="Learn about Grampians Hockey Club — our story, mission, values, and affiliation with Hockey Ballarat. Based in Ararat and Ballarat, Victoria." />
      {/* Hero Section */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">About Our Club</h1>
            <p className="text-xl text-primary-foreground/90">
              Discover the story behind Grampians Hockey Club
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Grampians Hockey Club was founded with a simple mission: to bring the joy of hockey to the Grampians region and create a welcoming community for players of all abilities.
                </p>
                <p>
                  Named after the majestic Grampians National Park, our club embodies the powerful spirit of the region — strength, resilience, and community. We train in Ararat and in Ballarat.
                </p>
                <p>
                  As part of Hockey Ballarat, we compete in Division 2 and are 
                  committed to developing players, fostering sportsmanship, and building lasting friendships 
                  both on and off the field.
                </p>
              </div>
              <Button asChild>
                <Link to="/join">
                  Join Our Story
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center">
              <div className="rounded-2xl bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex flex-col items-center justify-center p-12 gap-6 w-full">
                <img
                  src="/images/logo.png"
                  alt="Grampians Hockey Logo"
                  className="h-56 w-56 object-contain" />
                <div className="text-center space-y-1">
                  <p className="text-xl font-semibold text-foreground">Est. Grampians Region, VIC</p>
                  <p className="text-muted-foreground">Play. Volunteer. Support.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-section-alt">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-background border-2 border-primary/20">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide an inclusive, friendly environment where people of all ages and skill levels 
                  can enjoy hockey, develop their abilities, and become part of a supportive community.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-background border-2 border-secondary/20">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the heart of hockey in the Grampians region, growing our club while maintaining 
                  the friendly, welcoming atmosphere that makes us unique.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What We Stand For
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our values guide everything we do, from how we play to how we welcome new members.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Community First</h3>
              <p className="text-muted-foreground">
                We believe in the power of community. Our club is built on connections, friendships, 
                and mutual support that extends far beyond the hockey field.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Inclusive Spirit</h3>
              <p className="text-muted-foreground">
                Everyone deserves a place to play. We welcome players regardless of experience, 
                age, or background. If you want to be here, you belong here.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Continuous Growth</h3>
              <p className="text-muted-foreground">
                We're committed to helping every player improve, whether you're picking up a stick 
                for the first time or refining advanced techniques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliation */}
      <section className="py-16 bg-section-alt">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="flex items-center justify-center gap-3">
              <Handshake className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">Our Affiliation</h2>
            <p className="text-lg text-muted-foreground">
              Grampians Hockey is a proud member of <strong className="text-foreground">Hockey Ballarat</strong>. 
              Through this affiliation, we compete in regional competitions and connect with the broader 
              hockey community across the region.
            </p>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <MapPin className="h-6 w-6 text-primary" />
                <h2 className="text-3xl font-bold text-foreground">Find Us</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Training Venues</h3>
                  <p className="text-muted-foreground">2 Barkly St, Ararat VIC 3377</p>
                  <p className="text-muted-foreground">Prince of Wales Park, Ballarat</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Game Day</h3>
                  <p className="text-muted-foreground">Prince of Wales Park, Ballarat</p>
                </div>
                <p className="text-muted-foreground">
                  Our training sessions are held at both Ararat and Ballarat venues, making it accessible 
                  for players from across the Grampians region.
                </p>
                <div className="pt-4">
                  <h4 className="font-medium text-foreground mb-2">Training Schedule</h4>
                  <p className="text-muted-foreground">Wednesday - 6:30pm - Prince of Wales Park, Ballarat

                  </p>
                </div>
              </div>
              <Button asChild>
                <Link to="/contact">
                  Get Directions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.7!2d142.9301!3d-37.2834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad1456e5fa3c3c7%3A0x5045675218ceb80!2sGordon%20St%2C%20Ararat%20VIC%203377!5e0!3m2!1sen!2sau!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Gordon Street, Ararat Location"
                className="w-full" />

            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-hero-gradient text-primary-foreground">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the Pride?
          </h2>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto mb-8">
            Whether you want to play, volunteer, or simply support the club, we'd love to have you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-gold text-primary hover:bg-gold-light">
              <Link to="/join">
                Join Us Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>);

};

export default AboutPage;