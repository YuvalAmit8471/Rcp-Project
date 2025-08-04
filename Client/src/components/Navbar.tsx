import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ChefHat,
  Home,
  Plus,
  Sparkles,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  BookUser,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, logout } = useAuth();

  // Handle scroll behavior
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // גלילה למטה - הסתר navbar
        setIsVisible(false);
      } else {
        // גלילה למעלה - הצג navbar
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "See you soon!",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const isActivePath = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About", icon: BookUser },
    ...(user
      ? [
          { path: "/create", label: "Create", icon: Plus },
          { path: "/ai-generator", label: "AI", icon: Sparkles },
          { path: "/my-recipes", label: "My Recipes", icon: Heart },
        ]
      : []),
  ];

  return (
    <nav
      className={`bg-white/10 backdrop-blur-md border-b border-border/20 shadow-elevated fixed top-0 z-50 w-full transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity group"
          >
            <ChefHat className="h-10 w-10 text-primary group-hover:animate-bounce-soft" />
            <span className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              FlavorShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${
                  isActivePath(path)
                    ? "bg-primary text-primary-foreground shadow-button"
                    : "text-foreground hover:text-primary hover:bg-primary/10"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* User Section & Mobile Menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-muted-foreground">
                  Hello,{" "}
                  <span className="text-foreground font-semibold">
                    {user.name}
                  </span>
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="rounded-full hover:bg-destructive/10 hover:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" className="rounded-xl">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button
                    variant="default"
                    className="rounded-xl shadow-button"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border/50 py-4 animate-slide-up">
            <div className="space-y-2">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                    isActivePath(path)
                      ? "bg-primary text-primary-foreground shadow-button"
                      : "text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
