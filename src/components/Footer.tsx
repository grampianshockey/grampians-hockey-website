import { Link } from "react-router-dom";
import { MapPin, Mail, Phone, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Club Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/logo.png"
                alt="Grampians Hockey Logo"
                className="h-10 w-10 rounded-lg object-contain" />

              <div>
                <p className="font-bold text-lg leading-tight">Grampians Hockey</p>
                <p className="text-xs text-primary-foreground/70">Club</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Play. Volunteer. Support.
            </p>
            <p className="text-sm text-primary-foreground/70">
              Part of Hockey Ballarat
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Home
              </Link>
              <Link to="/about" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                About
              </Link>
              <Link to="/teams" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Teams
              </Link>
              <Link to="/news" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                News
              </Link>
              <Link to="/join" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                Join Us
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-primary-foreground/80">
                  <p>Barkly St, Ararat (Training)</p>
                  <p>Prince of Wales Park, Ballarat</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a href="mailto:committee@grampianshockey.com.au" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  committee@grampianshockey.com.au
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a href="tel:+61404770626" className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  0404 770 626
                </a>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/share/g/1DZswkSMy1/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
                aria-label="Facebook">

                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/70">
              © {currentYear} Grampians Hockey Club. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/contact" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>);

};

export default Footer;