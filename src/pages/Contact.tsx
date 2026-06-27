import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Mail, Phone, Clock, CheckCircle, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";

const ContactPage = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const { data: committeeMembers = [], isLoading: committeeLoading } = useQuery({
    queryKey: ["committee_members"],
    queryFn: async () => {
      const { data, error } = await supabase.
      from("committee_members").
      select("*").
      order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const { error } = await supabase.from("contact_submissions").insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
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
      title: "Message Sent!",
      description: "We'll get back to you as soon as possible."
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const roleColors = ["primary", "secondary", "accent"];

  return (
    <Layout>
      <SEO title="Contact Us" description="Get in touch with Grampians Hockey Club. Email, phone, or send us a message. Based in Ararat and Ballarat, Victoria." />
      {/* Hero Section */}
      <section className="bg-hero-gradient text-primary-foreground py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
            <p className="text-xl text-primary-foreground/90">
              We'd love to hear from you
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-4">Get in Touch</h2>
                <p className="text-muted-foreground">
                  Have a question about joining the club, upcoming events, or anything else? 
                  We're here to help. Reach out using any of the methods below or fill in the contact form.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Locations</h3>
                    <p className="text-muted-foreground">Ararat Training: Barkley St, Ararat, VIC 3377</p>
                    <p className="text-muted-foreground">Games & Training: Prince of Wales Park, Ballarat</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <a
                      href="mailto:committee@grampianshockey.com.au"
                      className="text-primary hover:underline">

                      committee@grampianshockey.com.au
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <a
                      href="tel:+61404770626"
                      className="text-primary hover:underline">

                      0404 770 626
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Training Times</h3>
                    <p className="text-muted-foreground">Wednesday - 6:30pm - Prince of Wales Park, Ballarat</p>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden shadow-lg">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3186.7!2d142.9301!3d-37.2834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad1456e5fa3c3c7%3A0x5045675218ceb80!2sGordon%20St%2C%20Ararat%20VIC%203377!5e0!3m2!1sen!2sau!4v1234567890"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Club Location"
                  className="w-full" />

              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  {isSubmitted ?
                  <div className="text-center py-8 space-y-4">
                      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for getting in touch. We'll respond to your message as soon as possible.
                      </p>
                      <Button
                      variant="outline"
                      className="hover:bg-muted hover:text-foreground"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormData({ name: "", email: "", subject: "", message: "" });
                      }}>

                        Send Another Message
                      </Button>
                    </div> :

                  <>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Send a Message</h2>
                        <p className="text-muted-foreground">
                          Fill out the form and we'll get back to you
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name *</Label>
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

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                          id="subject"
                          name="subject"
                          placeholder="What's this about?"
                          value={formData.subject}
                          onChange={handleChange}
                          required />

                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                          id="message"
                          name="message"
                          placeholder="Your message..."
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          required />

                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                          {isSubmitting ? "Sending..." : "Send Message"}
                          <Send className="ml-2 h-4 w-4" />
                        </Button>
                      </form>
                    </>
                  }
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Committee Section */}
      <section className="py-16 bg-section-alt">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Club Committee</h2>
            <p className="text-muted-foreground">
              Our club is run by a dedicated volunteer committee. If you have specific questions, 
              feel free to reach out directly to the relevant committee member.
            </p>
            {committeeLoading ?
            <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div> :

            <div className="grid sm:grid-cols-3 gap-6 pt-4">
                {committeeMembers.map((member, index) =>
              <Card key={member.id}>
                    <CardContent className="p-6 text-center">
                      <div className={`w-16 h-16 rounded-full bg-${roleColors[index % 3]}/10 flex items-center justify-center mx-auto mb-4`}>
                        <span className={`text-xl font-bold text-${roleColors[index % 3]}`}>
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </CardContent>
                  </Card>
              )}
              </div>
            }
          </div>
        </div>
      </section>
    </Layout>);

};

export default ContactPage;