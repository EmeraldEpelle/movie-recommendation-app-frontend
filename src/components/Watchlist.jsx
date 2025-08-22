import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Star, Trash2 } from 'lucide-react';

const Watchlist = () => {
  const { getWatchlist, removeFromWatchlist } = useAuth();
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const result = await getWatchlist();
        if (result.success) {
          setWatchlist(result.data);
        }
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [getWatchlist]);

  const handleRemoveFromWatchlist = async (movieId) => {
    setActionLoading(movieId);
    try {
      const result = await removeFromWatchlist(movieId);
      if (result.success) {
        setWatchlist(watchlist.filter(movie => movie.movieId !== movieId));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Bookmark className="h-8 w-8 mr-3 text-blue-500 fill-current" />
            My Watchlist
          </h1>
          <p className="text-muted-foreground mt-2">
            {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} to watch
          </p>
        </div>
      </div>

      {/* Watchlist Grid */}
      {watchlist.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {watchlist.map((movie) => (
            <Card key={movie.movieId} className="group relative">
              <CardContent className="p-0">
                <Link to={`/movie/${movie.movieId}`}>
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={movie.posterPath 
                        ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
                        : '/api/placeholder/300/450'
                      }
                      alt={movie.title}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </Link>
                
                {/* Remove Button */}
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemoveFromWatchlist(movie.movieId)}
                  disabled={actionLoading === movie.movieId}
                >
                  {actionLoading === movie.movieId ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="p-4">
                  <Link to={`/movie/${movie.movieId}`}>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {movie.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    Added {new Date(movie.addedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Bookmark className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground mb-6">
            Add movies you want to watch to keep track of them!
          </p>
          <Link to="/search">
            <Button>Find Movies to Watch</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Watchlist;

