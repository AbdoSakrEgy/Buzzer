import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/home" },
    { label: "About Us", href: "#about" },
    { label: "Restaurants", href: "#restaurants" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ];

  const socialLinks = [
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  ];

  return (
    <footer
      className="relative bg-black text-white overflow-hidden"
      id="contact"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/footer/footer.png"
          alt="Footer Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/home" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="Buzzer App"
                width={50}
                height={50}
                className="w-10 h-10"
              />
              <div className="flex items-baseline">
                <span className="text-lg font-bold tracking-wide">BUZZER</span>
                <span className="text-lg font-light tracking-wide ml-1">
                  APP
                </span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Discover the best restaurants and cafes in your area. Order your
              favorite food with just a few taps.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-amber-500 rounded-full flex items-center justify-center transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-amber-400 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">
                  123 Business Street, Cairo, Egypt
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-amber-400 shrink-0" />
                <a
                  href="tel:+971123456789"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  +201 00 713 7667
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-amber-400 shrink-0" />
                <a
                  href="mailto:abdulrahimsakr01@gmail.com"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  abdulrahimsakr01@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe to get the latest updates and offers.
            </p>
            <form className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-all text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium rounded-lg transition-all text-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} Buzzer App. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
