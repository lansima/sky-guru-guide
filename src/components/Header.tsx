import { Plane } from "lucide-react";
import { Link } from "react-router-dom";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Aircraft Manuals", href: "/#manuals" },
  { label: "Systems Docs", href: "/#systems" },
  { label: "AI Instructor", href: "/#ai-instructor" },
  { label: "Contact", href: "/#contact" },
];

export function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <Plane className="h-6 w-6 text-primary" />
          <div className="flex flex-col leading-none">
            <span className="text-lg font-bold text-white tracking-tight">SMART</span>
            <span className="text-lg font-bold text-white tracking-tight">COCKPIT</span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
