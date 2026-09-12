import { useEffect, useState } from "react";
import { Menu, X, Leaf } from "lucide-react";
import { NAV } from "./data";

export function Header() {
  const [aberto, setAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-background/95 backdrop-blur border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:py-4">
        <a href="#inicio" className="flex min-w-0 items-center gap-2">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${
              scrolled ? "bg-primary text-primary-foreground" : "bg-background/25 text-background"
            }`}
          >
            <Leaf className="h-5 w-5" />
          </span>
          <span className="min-w-0">
            <span
              className={`block truncate font-display text-lg font-semibold leading-tight ${
                scrolled ? "text-foreground" : "text-background"
              }`}
            >
              Chácara Oasis
            </span>
            <span
              className={`hidden text-[11px] uppercase tracking-[0.2em] sm:block ${
                scrolled ? "text-muted-foreground" : "text-background/80"
              }`}
            >
              Araçariguama · SP
            </span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-6 lg:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-opacity hover:opacity-70 ${
                  scrolled ? "text-foreground" : "text-background"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <a
            href="#reservas"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.03] sm:inline-flex"
          >
            Reservar agora
          </a>
          <button
            type="button"
            aria-label="Abrir menu"
            onClick={() => setAberto((v) => !v)}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full lg:hidden ${
              scrolled ? "bg-secondary text-secondary-foreground" : "bg-background/25 text-background"
            }`}
          >
            {aberto ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {aberto && (
        <nav className="border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setAberto(false)}
              className="block border-b border-border/60 py-3 text-sm font-medium text-foreground"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#reservas"
            onClick={() => setAberto(false)}
            className="mt-4 block rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground"
          >
            Reservar agora
          </a>
        </nav>
      )}
    </header>
  );
}
