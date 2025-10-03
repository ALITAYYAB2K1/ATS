import { Link, useNavigate, useLocation } from "react-router";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { account } from "../lib/appwrite";
import { cn } from "../lib/utils";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await account.get();
        if (mounted) setUser(me);
      } catch {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setChecked(true);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
    } catch (e) {
      // ignore
    } finally {
      // Force a reload to clear any client state & go home
      navigate("/");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  };

  const isAnon = user?.labels?.includes("anonymous");
  const isAuthed = !!user && !isAnon; // hide auth buttons only when real user session

  const navLinks = [
    { to: "/", label: "Home", auth: false, isActive: (p: string) => p === "/" },
    {
      to: "/upload",
      label: "Upload",
      auth: false,
      isActive: (p: string) => p.startsWith("/upload"),
    },
    {
      to: "/history",
      label: "History",
      auth: true,
      isActive: (p: string) => p.startsWith("/history"),
    },
    {
      to: "/about",
      label: "About",
      auth: false,
      isActive: (p: string) => p.startsWith("/about"),
    },
  ];

  const pathname = location.pathname;
  const baseLink =
    "relative px-5 py-2.5 text-[15px] font-medium rounded-full transition-colors duration-200";
  // Subtle, low-vibrancy active style (less flashy)
  const activeClasses =
    "bg-white/80 dark:bg-white/10 text-foreground shadow-sm ring-1 ring-black/10 dark:ring-white/15 backdrop-blur";
  const inactiveClasses =
    "text-foreground/60 hover:text-foreground hover:bg-white/40 dark:hover:bg-white/10";

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
                      {l.label}
                    </Link>
                  );
                })}
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-3 min-w-[240px] justify-end">
          {!checked && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Loading...
            </span>
          )}
          {checked && !isAuthed && (
            <>
              <Link to="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 px-5 text-[15px]"
                >
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="text-white h-10 px-5 text-[15px] font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-600 hover:to-purple-600/90 shadow-sm"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
          {checked && isAuthed && (
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
                className="h-10 px-5 text-[15px] hover:bg-red-500/10 hover:text-red-600"
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
