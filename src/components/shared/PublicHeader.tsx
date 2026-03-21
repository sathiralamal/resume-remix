import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import ThemeToggle from "./ThemeToggle";

export default async function PublicHeader() {
  const session = await getServerSession(authOptions);

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-foreground hover:opacity-70 transition-opacity"
        >
          Resume Remxi
        </Link>

        {/* Center nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-6">
          {session && (
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/how-to"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/privacy-policy"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
        </nav>

        {/* Right: actions */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="hidden sm:block h-4 w-px bg-border" />
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-muted btn-hover transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="btn-hover btn-active inline-flex items-center justify-center px-4 py-1.5 text-sm font-medium text-primary-foreground bg-primary rounded-lg transition-all"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}
