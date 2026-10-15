"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, X } from "lucide-react";
import { signOut, useSession } from "@/lib/auth/client";
import { ROUTES } from "@/lib/routes";
import UtilityBar from "@/components/layout/navbar/UtilityBar";
import CatalogueMenu from "@/components/layout/navbar/CatalogueMenu";
import AccountMenu from "@/components/layout/navbar/AccountMenu";
import MobileDrawer from "@/components/layout/navbar/MobileDrawer";
import { NAV_LINKS, SLANT, focusRing, isActive, toSessionUser } from "@/components/layout/navbar/config";

/**
 * Site header: utility bar, main bar (with scroll progress line and Catalogue
 * mega menu) and a full-screen drawer on small screens.
 * It reads the Better Auth session itself, so a plain <Navbar /> works on every page.
 */
export default function Navbar() {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = toSessionUser(session?.user);

  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const progressRef = useRef<HTMLSpanElement>(null);

  // Shrink the header and fill the red progress line while scrolling
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 16);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  useEffect(() => setMobileOpen(false), [pathname]);

  const closeDrawer = useCallback(() => setMobileOpen(false), []);

  const handleLogout = async () => {
    setMobileOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push(ROUTES.home);
          router.refresh();
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50">
      <UtilityBar hidden={scrolled} />

      <nav
        aria-label="Navigation principale"
        className={`relative border-b backdrop-blur-md transition-all duration-300 motion-reduce:transition-none ${
          mobileOpen ? "bg-white" : "bg-white/90"
        } ${scrolled ? "border-gray-200 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]" : "border-gray-100"}`}
      >
        {/* Signature line: also shows how far down the page you are */}
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-black/10">
          <span ref={progressRef} className="block h-full w-0 bg-[#D80005]" />
        </span>

        <div
          className={`mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 transition-all duration-300 motion-reduce:transition-none ${
            scrolled ? "h-[68px]" : "h-20 lg:h-24"
          }`}
        >
          {/* Logo */}
          <Link href={ROUTES.home} className={`flex items-center ${focusRing}`} aria-label="AUTO ZONE, accueil">
            <Image
              src="/logos.jpeg"
              alt="AUTO ZONE Import & Export"
              width={180}
              height={48}
              priority
              style={{ width: "auto" }}
              className={`object-contain transition-all duration-300 motion-reduce:transition-none ${
                scrolled ? "h-10" : "h-12"
              }`}
            />
          </Link>

          {/* Desktop links */}
          <div className="hidden lg:flex items-center gap-8 xl:gap-9">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href, pathname);
              if (link.menu) return <CatalogueMenu key={link.href} active={active} />;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`group relative py-2 text-[15px] font-semibold tracking-tight transition-colors duration-200 ${focusRing} ${
                    active ? "text-[#D80005]" : "text-black hover:text-[#D80005]"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className={`absolute -bottom-0.5 left-0 h-[3px] w-full origin-left bg-[#D80005] transition-transform duration-300 ease-out ${
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Desktop actions */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5">
            {isPending ? (
              <div aria-hidden="true" className="h-11 w-36 animate-pulse rounded-full bg-gray-100" />
            ) : user ? (
              <AccountMenu user={user} onLogout={handleLogout} />
            ) : (
              <>
                <Link
                  href={ROUTES.login}
                  aria-current={isActive(ROUTES.login, pathname) ? "page" : undefined}
                  className={`flex items-center gap-2 text-[15px] font-semibold transition-colors duration-200 hover:text-[#D80005] ${focusRing} ${
                    isActive(ROUTES.login, pathname) ? "text-[#D80005]" : "text-black"
                  }`}
                >
                  <User size={17} aria-hidden="true" />
                  Connexion
                </Link>
                <Link
                  href={ROUTES.register}
                  aria-current={isActive(ROUTES.register, pathname) ? "page" : undefined}
                  className={`hidden xl:inline-flex rounded-full border px-5 py-2.5 text-[14px] font-semibold transition-colors duration-200 hover:border-black hover:bg-black hover:text-white ${focusRing} ${
                    isActive(ROUTES.register, pathname)
                      ? "border-[#D80005] text-[#D80005]"
                      : "border-gray-300 text-black"
                  }`}
                >
                  Inscription
                </Link>
              </>
            )}

            <Link
              href={ROUTES.contact}
              style={{ clipPath: SLANT }}
              className={`bg-[#D80005] px-9 py-3.5 text-[14px] font-bold text-white transition-colors duration-300 hover:bg-black active:scale-95 ${focusRing}`}
            >
              Contactez-nous
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((p) => !p)}
            className={`lg:hidden flex h-11 w-11 items-center justify-center rounded-full text-white transition-colors ${focusRing} ${
              mobileOpen ? "bg-[#D80005]" : "bg-black hover:bg-[#D80005]"
            }`}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <MobileDrawer
        open={mobileOpen}
        user={user}
        loading={isPending}
        onClose={closeDrawer}
        onLogout={handleLogout}
      />
    </header>
  );
}