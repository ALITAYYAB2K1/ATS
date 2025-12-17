import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { account } from "../lib/appwrite";
import { cn } from "../lib/utils";
import { useAuth } from "./auth-context";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, refreshUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await account.deleteSession("current");
    } catch {}
    await refreshUser();
    navigate("/");
    setLoggingOut(false);
    try {
      (window as any).__authRefresh?.();
    } catch {}
  };

  const isAnon = user?.labels?.includes("anonymous");
  const isAuthed = !!user && !isAnon;

  const navLinks = [
    { to: "/", label: "Home", auth: false, isActive: (p: string) => p === "/" },
    {
      to: "/upload",
      label: "Upload",
      auth: false,
      isActive: (p: string) => p.startsWith("/upload"),
    },
    {
      to: "/about",
      label: "About",
      auth: false,
      isActive: (p: string) => p.startsWith("/about"),
    },
    {
      to: "/history",
      label: "History",
      auth: true,
      isActive: (p: string) => p.startsWith("/history"),
    },
  ];

  const pathname = location.pathname;
  const baseLink =
    "relative group flex items-center justify-center px-6 py-2.5 text-[16px] font-semibold rounded-full transition-all duration-200 cursor-pointer";
  // Subtle, low-vibrancy active style (less flashy)
  const activeClasses =
    "bg-blue-600 text-white shadow-lg ring-1 ring-blue-600/40 backdrop-blur translate-x-[2px]";
  const inactiveClasses = "hover:bg-blue-50";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur bg-white/65 dark:bg-background/70 supports-[backdrop-filter]:bg-white/55 shadow-sm">
      <div className="container mx-auto flex h-20 items-center justify-between gap-6 px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 group-hover:brightness-110 transition">
            ATS
          </span>
          <span className="sr-only">Home</span>
        </Link>
        <div className="hidden md:block">
          <div className="flex items-center rounded-full ring-1 ring-black/10 dark:ring-white/15 bg-white/50 dark:bg-white/5 backdrop-blur px-1 py-1">
            <nav aria-label="Main" className="flex gap-1">
              {navLinks
                .filter((l) => (l.auth ? isAuthed : true))
                .map((l) => {
                  const active = l.isActive(pathname);
                  return (
                    <Link
                      key={l.to}
                      to={l.to}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        baseLink,
                        active ? activeClasses : inactiveClasses,
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 focus-visible:ring-offset-2 ring-offset-background"
                      )}
                    >
                      <span
                        className={cn(
                          "transition-all duration-200",
                          active
                            ? "text-white"
                            : "bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text text-transparent group-hover:brightness-110"
                        )}
                      >
                        {l.label}
                      </span>
                    </Link>
                  );
                })}
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-3 min-w-[120px] justify-end">
          {loading && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Loading...
            </span>
          )}
          {!loading && !isAuthed && (
            <>
              <Link to="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-5 text-[15px] transition-all duration-200 will-change-transform hover:-translate-y-[3px] hover:translate-x-[2px] hover:shadow-[0_10px_22px_-6px_rgba(0,0,0,0.25)] active:translate-y-0 active:translate-x-0 active:shadow-sm cursor-pointer"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="text-white h-10 px-5 text-[15px] font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-600 hover:to-purple-600/90 shadow-md transition-all duration-200 will-change-transform hover:-translate-y-[3px] hover:translate-x-[2px] hover:shadow-[0_14px_26px_-8px_rgba(56,97,251,0.45)] active:translate-y-0 active:translate-x-0 active:shadow-sm cursor-pointer"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
          {!loading && isAuthed && (
            <>
              <span
                className="hidden md:inline text-sm text-foreground/80 max-w-[160px] truncate"
                title={user.email || user.name}
              >
                {user.name || user.email || "Account"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                disabled={loggingOut}
                className="h-10 px-5 text-[15px] hover:bg-red-500/10 hover:text-red-600 disabled:opacity-50 transition-all duration-200 will-change-transform hover:-translate-y-[3px] hover:translate-x-[2px] hover:shadow-[0_10px_22px_-6px_rgba(0,0,0,0.25)] active:translate-y-0 active:translate-x-0 active:shadow-sm cursor-pointer"
              >
                {loggingOut ? "..." : "Logout"}
              </Button>
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white/80 p-2 text-slate-600 shadow-sm transition hover:bg-white"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 top-20 z-30 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="md:hidden fixed top-20 left-0 right-0 z-40 mx-4 rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <nav className="flex flex-col divide-y divide-slate-100">
              {navLinks
                .filter((l) => (l.auth ? isAuthed : true))
                .map((l) => {
                  const active = l.isActive(pathname);
                  return (
                    <Link
                      key={`mobile-${l.to}`}
                      to={l.to}
                      className={cn(
                        "px-6 py-4 text-lg font-semibold transition-all",
                        active
                          ? "bg-blue-50 text-blue-700"
                          : "text-slate-700 hover:bg-blue-50"
                      )}
                    >
                      {l.label}
                    </Link>
                  );
                })}
            </nav>
            <div className="p-4 flex flex-col gap-3">
              {!loading && !isAuthed && (
                <>
                  <Link to="/signin" className="w-full">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link to="/signup" className="w-full">
                    <Button
                      className="w-full"
                      onClick={() => setMobileOpen(false)}
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
              {!loading && isAuthed && (
                <div className="flex flex-col gap-2">
                  <span className="text-sm text-slate-600 truncate">
                    {user.name || user.email || "Account"}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    disabled={loggingOut}
                  >
                    {loggingOut ? "..." : "Logout"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  );
}
