import { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckCircle, Users, Heart, Trophy, Handshake, ArrowRight, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const JoinPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    dateOfBirth: undefined as Date | undefined,
    interest: "",
    experience: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("join_submissions").insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || null,
      date_of_birth: formData.dateOfBirth ? format(formData.dateOfBirth, "yyyy-MM-dd") : null,
      interest: formData.interest || null,
      experience: formData.experience || null,
      message: formData.message || null
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitted(true);
    toast({
      title: "Registration Submitted!",
      description: "We'll be in touch soon to welcome you to Grampians Hockey."
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Layout>
      <SEO title="Join Us" description="Register your interest to join Grampians Hockey. All skill levels welcome — play hockey, volunteer, or support the club." />
      {/* Hero Section */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Join Grampians Hockey</h1>
            <p className="text-xl text-primary-foreground/90">
              Become part of our friendly hockey community
            </p>
          </div>
        </div>
      </section>

      {/* Why Join Section */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Join Grampians Hockey?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              There are so many great reasons to be part of our club
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6 px-6 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Friendly Community</h3>
                <p className="text-sm text-muted-foreground">
                  Join a welcoming group of players who love the game
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6 px-6 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="font-semibold text-foreground">All Skill Levels</h3>
                <p className="text-sm text-muted-foreground">
                  Beginners and experienced players are equally welcome
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6 px-6 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">Regular Competition</h3>
                <p className="text-sm text-muted-foreground">
                  Play in the Hockey Ballarat Division 2 competition
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6 px-6 space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Social Events</h3>
                <p className="text-sm text-muted-foreground">
                  BBQs, end of season celebrations, and more
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Registration Form Section */}
      <section className="py-16 bg-section-alt">
        <div className="container px-4 md:px-6">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
              <CardContent className="p-8">
                {isSubmitted ?
                <div className="text-center py-8 space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Thank You!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your interest has been registered. A member of our committee will be in touch 
                      within the next few days to welcome you and provide more information.
                    </p>
                    <div className="pt-4">
                      <h4 className="font-semibold text-foreground mb-2">What happens next?</h4>
                      <ul className="text-sm text-muted-foreground space-y-2">
                        <li>✓ We'll contact you to answer any questions</li>
                        <li>✓ You'll receive information about training times</li>
                        <li>✓ We'll help you get set up for the season</li>
                      </ul>
                    </div>
                  </div> :

                <>
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold text-foreground mb-2">Register Your Interest</h2>
                      <p className="text-muted-foreground">
                        Fill out the form below and we'll be in touch
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                          id="name"
                          name="name"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={handleChange}
                          required />

                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleChange}
                          required />

                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="0400 000 000"
                          value={formData.phone}
                          onChange={handleChange} />

                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="interest">I'm interested in...</Label>
                          <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, interest: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="playing">Playing Hockey</SelectItem>
                              <SelectItem value="volunteering">Volunteering</SelectItem>
                              <SelectItem value="both">Both Playing & Volunteering</SelectItem>
                              <SelectItem value="supporting">Supporting the Club</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Date of Birth</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !formData.dateOfBirth && "text-muted-foreground"
                              )}>

                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : "Pick a date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                              mode="single"
                              selected={formData.dateOfBirth}
                              onSelect={(date) => setFormData((prev) => ({ ...prev, dateOfBirth: date }))}
                              disabled={(date) => date > new Date()}
                              captionLayout="dropdown-buttons"
                              fromYear={1930}
                              toYear={new Date().getFullYear()}
                              initialFocus
                              className="pointer-events-auto" />

                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">Hockey Experience</Label>
                          <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, experience: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">Complete beginner</SelectItem>
                              <SelectItem value="some">Played a little before</SelectItem>
                              <SelectItem value="social">Played socially</SelectItem>
                              <SelectItem value="competitive">Played competitively</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Anything else you'd like us to know?</Label>
                        <Textarea
                        id="message"
                        name="message"
                        placeholder="Any questions, concerns, or things you'd like to share..."
                        rows={4}
                        value={formData.message}
                        onChange={handleChange} />

                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Expression of Interest"}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>

                      <a
                        href="https://www.revolutionise.com.au/grampianshc/registration"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button type="button" variant="secondary" className="w-full" size="lg">
                          Register to Play
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </a>
                    </form>
                  </>
                }
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Volunteer Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Handshake className="h-12 w-12 text-primary mx-auto" />
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Not a Player? You Can Still Help!
            </h2>
            <p className="text-lg text-muted-foreground">
              Our club runs on the dedication of volunteers. Whether it's helping on game days, 
              assisting with administration, or supporting club events, there's a place for you. 
              Many hands make light work!
            </p>
            <div className="grid sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-medium text-foreground">Game Day Help</p>
                <p className="text-sm text-muted-foreground">Managing, setup, scoring</p>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-medium text-foreground">Committee Roles</p>
                <p className="text-sm text-muted-foreground">Help run the club</p>
              </div>
              <div className="p-4 bg-card rounded-lg border">
                <p className="font-medium text-foreground">Events & Fundraising</p>
                <p className="text-sm text-muted-foreground">Social activities</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>);

};

export default JoinPage;