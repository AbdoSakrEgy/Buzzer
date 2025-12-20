"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, User, ShoppingCart, LogIn, UserPlus } from "lucide-react";
import { useAuth, useCart } from "@/src/context";

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll to change navbar background
  // Always show scrolled state on certain routes
  useEffect(() => {
    const handleScroll = () => {
      const alwaysScrolledRoutes = [
        "/profile",
        "/profile-edit",
        "/orders-history",
        "/orders-history/order-details",
      ];
      const isAlwaysScrolled = alwaysScrolledRoutes.some(
        (route) => pathname === route || pathname.startsWith(route + "/")
      );
      setIsScrolled(isAlwaysScrolled || window.scrollY > 50);
    };

    // Set initial state
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/home" },
    { label: "Restaurants", href: "/restaurant" },
    { label: "Products", href: "/products" },
    { label: "About Us", href: "/about" },
    { label: "Contact US", href: "/contact" },
  ];

  const linkClasses = (isActive: boolean) =>
    `transition-colors font-medium ${
      isActive
        ? "text-amber-500"
        : isScrolled
        ? "text-gray-600 hover:text-amber-500"
        : "text-white hover:text-amber-400"
    }`;

  const iconClasses = (isActive: boolean) =>
    `p-2 rounded-full transition-colors ${
      isActive
        ? "text-amber-500"
        : isScrolled
        ? "text-gray-600 hover:text-amber-500"
        : "text-white hover:text-amber-400"
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link href="/home" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Buzzer App"
              width={50}
              height={50}
              className="w-10 h-10 md:w-12 md:h-12"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname.startsWith(link.href) && link.href !== "/home");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={linkClasses(isActive)}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side - Auth Buttons or Icons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* Cart Icon with Badge */}
                <Link
                  href="/cart"
                  className={`${iconClasses(pathname === "/cart")} relative`}
                  aria-label="Cart"
                >
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
                {/* Profile Icon */}
                <Link
                  href="/profile"
                  className={iconClasses(pathname === "/profile")}
                  aria-label="Profile"
                >
                  <User size={22} />
                </Link>
              </>
            ) : (
              <>
                {/* Login Button */}
                <Link
                  href="/login"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors font-medium ${
                    isScrolled
                      ? "text-gray-600 hover:text-amber-500 border border-gray-200 hover:border-amber-400"
                      : "text-white hover:text-amber-400 border border-white/30 hover:border-amber-400"
                  }`}
                >
                  <LogIn size={18} />
                  Login
                </Link>
                {/* Register Button */}
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500 text-white font-medium hover:bg-amber-600 transition-colors"
                >
                  <UserPlus size={18} />
                  Register
                </Link>
              </>
            )}
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
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (pathname.startsWith(link.href) && link.href !== "/home");

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`block py-2 transition-colors font-medium ${
                    isActive
                      ? "text-amber-500"
                      : "text-gray-600 hover:text-amber-500"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="border-t border-gray-100 pt-4 mt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/cart"
                    className={`flex items-center gap-2 py-2 transition-colors font-medium ${
                      pathname === "/cart"
                        ? "text-amber-500"
                        : "text-gray-600 hover:text-amber-500"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart size={20} />
                    Cart {cartCount > 0 && `(${cartCount})`}
                  </Link>
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 py-2 transition-colors font-medium ${
                      pathname === "/profile"
                        ? "text-amber-500"
                        : "text-gray-600 hover:text-amber-500"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={20} />
                    Profile
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 py-2 text-gray-600 hover:text-amber-500 transition-colors font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={20} />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 py-2 text-amber-500 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus size={20} />
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
