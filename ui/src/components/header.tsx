import Link from "next/link";
import { Button } from "@/components/ui/button";

export const Header = () => {
  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <header className="w-full max-w-5xl rounded-full border border-white/20 bg-white/10 backdrop-blur-md shadow-purple-glow">
        <div className="container flex h-14 items-center justify-between px-6">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-1 group">
            <span style={{ fontFamily: 'var(--font-cedarville)' }} className="font-cedarville text-3xl text-primary transition-transform group-hover:-rotate-3">
              costudy
            </span>
          </Link>

          {/* Navigation Tabs - Hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#rooms" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Study Rooms
            </Link>
            <Link href="#community" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Community
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-full bg-primary hover:bg-primary/90 px-5 shadow-sm">
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
};
