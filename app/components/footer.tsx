export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} ATS. Built with ❤️. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
