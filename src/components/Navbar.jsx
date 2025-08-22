import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Search, 
  Heart, 
  Bookmark, 
  User, 
  LogOut, 
  Menu, 
  X,
  Film
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-xl font-bold text-primary hover:text-primary/80 transition-colors"
            onClick={closeMenu}
          >
            <Film className="h-6 w-6" />
            <span>MovieFlix</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/search" 
              className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Link>

            {user ? (
              <>
                <Link 
                  to="/favorites" 
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </Link>
                <Link 
                  to="/watchlist" 
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Bookmark className="h-4 w-4" />
                  <span>Watchlist</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/search" 
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                onClick={closeMenu}
              >
                <Search className="h-4 w-4" />
                <span>Search</span>
              </Link>

              {user ? (
                <>
                  <Link 
                    to="/favorites" 
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                    onClick={closeMenu}
                  >
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                  <Link 
                    to="/watchlist" 
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                    onClick={closeMenu}
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Watchlist</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors"
                    onClick={closeMenu}
                  >
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent transition-colors text-left w-full"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={closeMenu}>
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

