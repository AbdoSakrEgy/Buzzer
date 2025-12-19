"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, User, Bell } from "lucide-react";

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Contact US", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Only Image */}
          <Link href="/home" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Buzzer App"
              width={50}
              height={50}
              className="w-10 h-10 md:w-12 md:h-12"
            />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, index) => (
              <Link
                key={link.label}
                href={link.href}
                className={`transition-colors font-medium ${
                  index === 0
                    ? "text-amber-500"
                    : isScrolled
                    ? "text-gray-600 hover:text-amber-500"
                    : "text-white hover:text-amber-400"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Icons - Desktop */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href={isLoggedIn ? "/profile" : "/login"}
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? "text-gray-600 hover:text-amber-500"
                  : "text-white hover:text-amber-400"
              }`}
              aria-label="Account"
            >
              <User size={22} />
            </Link>
            <Link
              href="/cart"
              className={`p-2 rounded-full transition-colors ${
                isScrolled
                  ? "text-gray-600 hover:text-amber-500"
                  : "text-white hover:text-amber-400"
              }`}
              aria-label="Cart"
            >
              <Bell size={22} />
            </Link>
            <button
              className={`p-2 transition-colors ${
                isScrolled
                  ? "text-gray-600 hover:text-amber-500"
                  : "text-white hover:text-amber-400"
              }`}
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden p-2 transition-colors ${
              isScrolled
                ? "text-gray-600 hover:text-amber-500"
                : "text-white hover:text-amber-400"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block py-2 text-gray-600 hover:text-amber-500 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
              <Link
                href={isLoggedIn ? "/profile" : "/login"}
                className="flex items-center gap-2 py-2 text-gray-600 hover:text-amber-500 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <User size={20} />
                {isLoggedIn ? "Profile" : "Login"}
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-2 py-2 text-gray-600 hover:text-amber-500 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Bell size={20} />
                Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
