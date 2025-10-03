import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export default function Navbar() {
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
            to="/about"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
}
