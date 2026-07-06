import { useEffect, useRef, useState } from 'react';

const navLinks = [
  { label: 'Mission', href: '#mission' },
  { label: 'Programs', href: '#programs' },
  { label: 'Impact', href: '#impact' },
  { label: 'Team', href: '#team' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out"
        style={{
          height: 64,
          backgroundColor: scrolled ? "rgba(44, 42, 107, 0.9)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
        }}
      >
        <div className="flex items-center justify-between h-full px-5 md:px-10 max-w-[1440px] mx-auto">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="/images/blancquake.png"
              alt="Blancquake Foundation logo"
              loading="lazy"
              className="h-8 w-8 object-contain"
            />
            <span className="text-white font-body text-sm font-medium tracking-wide">
              Blancquake Foundation
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-white font-body text-sm font-medium relative group"
              >
                {link.label}
                <span className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-[#F7C518] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </a>
            ))}
          </div>

          {/* Donate Button */}
          <div className="hidden lg:block">
            <a
              href="#donate"
              onClick={(e) => handleNavClick(e, "#donate")}
              className="bg-[#C14B3C] text-white font-body text-sm font-medium px-6 py-2 rounded-full hover:bg-[#A33D30] transition-colors duration-300"
            >
              Donate
            </a>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          menuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: "rgba(44, 42, 107, 0.97)" }}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8">
          {navLinks.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-white font-heading text-3xl transition-all duration-500"
              style={{
                transitionDelay: menuOpen ? `${i * 100}ms` : "0ms",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#donate"
            onClick={(e) => handleNavClick(e, "#donate")}
            className="bg-[#C14B3C] text-white font-body text-lg font-medium px-8 py-3 rounded-full mt-4 transition-all duration-500"
            style={{
              transitionDelay: menuOpen ? "500ms" : "0ms",
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Donate
          </a>
        </div>
      </div>
    </>
  );
}
