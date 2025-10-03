import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { account } from "../lib/appwrite";

export default function Navbar() {
  const navigate = useNavigate();
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
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            ATS
          </span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Home
          </Link>
          <Link
            to="/upload"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Upload
          </Link>
          <Link
            to="/history"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            History
          </Link>
          <Link
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2 min-w-[180px] justify-end">
          {!checked && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Loading...
            </span>
          )}
          {checked && !isAuthed && (
            <>
              <Link to="/signin">
                <Button variant="outline" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
          {checked && isAuthed && (
            <>
              <span
                className="hidden md:inline text-sm text-muted-foreground max-w-[160px] truncate"
                title={user.email || user.name}
              >
                {user.name || user.email || "Account"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600"
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
