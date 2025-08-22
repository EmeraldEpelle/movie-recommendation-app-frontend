import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Star, 
  Heart, 
  Bookmark, 
  Calendar, 
  Clock, 
  Globe,
  DollarSign,
  Play,
  Users,
  ArrowLeft
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const MovieDetails = () => {
  const { id } = useParams();
  const { user, addToFavorites, removeFromFavorites, addToWatchlist, removeFromWatchlist } = useAuth();
  const [movie, setMovie] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [userLists, setUserLists] = useState({
    favorites: [],
    watchlist: []
  });

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [movieResponse, similarResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/movies/${id}`),
          fetch(`${API_BASE_URL}/movies/${id}/similar`)
        ]);

        const movieData = await movieResponse.json();
        const similarData = await similarResponse.json();

        setMovie(movieData);
        setSimilarMovies(similarData.results?.slice(0, 6) || []);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Fetch user's favorites and watchlist if logged in
  useEffect(() => {
    const fetchUserLists = async () => {
      if (!user) return;

      try {
        const [favoritesResponse, watchlistResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/users/favorites`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }),
          fetch(`${API_BASE_URL}/users/watchlist`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          })
        ]);

        const favoritesData = await favoritesResponse.json();
        const watchlistData = await watchlistResponse.json();

        setUserLists({
          favorites: favoritesData.favorites || [],
          watchlist: watchlistData.watchlist || []
        });
      } catch (error) {
        console.error('Error fetching user lists:', error);
      }
    };

    fetchUserLists();
  }, [user]);

  const isInFavorites = userLists.favorites.some(fav => fav.movieId === parseInt(id));
  const isInWatchlist = userLists.watchlist.some(item => item.movieId === parseInt(id));

  const handleFavoriteToggle = async () => {
    if (!user) {
      setMessage('Please log in to add movies to favorites');
      return;
    }

    setActionLoading(true);
    try {
      if (isInFavorites) {
        const result = await removeFromFavorites(id);
        if (result.success) {
          setUserLists(prev => ({
            ...prev,
            favorites: prev.favorites.filter(fav => fav.movieId !== parseInt(id))
          }));
          setMessage('Removed from favorites');
        }
      } else {
        const result = await addToFavorites({
          movieId: parseInt(id),
          title: movie.title,
          posterPath: movie.poster_path
        });
        if (result.success) {
          setUserLists(prev => ({
            ...prev,
            favorites: [...prev.favorites, { movieId: parseInt(id), title: movie.title, posterPath: movie.poster_path }]
          }));
          setMessage('Added to favorites');
        }
      }
    } catch (error) {
      setMessage('Error updating favorites');
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleWatchlistToggle = async () => {
    if (!user) {
      setMessage('Please log in to add movies to watchlist');
      return;
    }

    setActionLoading(true);
    try {
      if (isInWatchlist) {
        const result = await removeFromWatchlist(id);
        if (result.success) {
          setUserLists(prev => ({
            ...prev,
            watchlist: prev.watchlist.filter(item => item.movieId !== parseInt(id))
          }));
          setMessage('Removed from watchlist');
        }
      } else {
        const result = await addToWatchlist({
          movieId: parseInt(id),
          title: movie.title,
          posterPath: movie.poster_path
        });
        if (result.success) {
          setUserLists(prev => ({
            ...prev,
            watchlist: [...prev.watchlist, { movieId: parseInt(id), title: movie.title, posterPath: movie.poster_path }]
          }));
          setMessage('Added to watchlist');
        }
      }
    } catch (error) {
      setMessage('Error updating watchlist');
    } finally {
      setActionLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatRuntime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Movie not found</p>
        <Link to="/">
          <Button className="mt-4">Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      {/* Message Alert */}
      {message && (
        <Alert>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      {/* Movie Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Poster */}
        <div className="lg:col-span-1">
          <img
            src={movie.poster_path 
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : '/api/placeholder/400/600'
            }
            alt={movie.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Movie Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-muted-foreground italic mb-4">{movie.tagline}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <Badge variant="secondary" className="text-lg px-3 py-1">
                <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                {movie.vote_average?.toFixed(1)}
              </Badge>
              <div className="flex items-center text-muted-foreground">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(movie.release_date).getFullYear()}
              </div>
              <div className="flex items-center text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                {formatRuntime(movie.runtime)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <Badge key={genre.id} variant="outline">
                  {genre.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleFavoriteToggle}
              disabled={actionLoading}
              variant={isInFavorites ? "default" : "outline"}
              className="flex items-center"
            >
              <Heart className={`h-4 w-4 mr-2 ${isInFavorites ? 'fill-current' : ''}`} />
              {isInFavorites ? 'In Favorites' : 'Add to Favorites'}
            </Button>
            <Button
              onClick={handleWatchlistToggle}
              disabled={actionLoading}
              variant={isInWatchlist ? "default" : "outline"}
              className="flex items-center"
            >
              <Bookmark className={`h-4 w-4 mr-2 ${isInWatchlist ? 'fill-current' : ''}`} />
              {isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </Button>
          </div>

          {/* Overview */}
          <div>
            <h2 className="text-2xl font-semibold mb-3">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {movie.budget > 0 && (
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Budget</p>
                  <p className="text-muted-foreground">{formatCurrency(movie.budget)}</p>
                </div>
              </div>
            )}
            {movie.revenue > 0 && (
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Revenue</p>
                  <p className="text-muted-foreground">{formatCurrency(movie.revenue)}</p>
                </div>
              </div>
            )}
            {movie.spoken_languages?.length > 0 && (
              <div className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Languages</p>
                  <p className="text-muted-foreground">
                    {movie.spoken_languages.map(lang => lang.english_name).join(', ')}
                  </p>
                </div>
              </div>
            )}
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="font-medium">Vote Count</p>
                <p className="text-muted-foreground">{movie.vote_count?.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cast & Crew */}
      {movie.credits?.cast?.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Cast</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movie.credits.cast.slice(0, 12).map((person) => (
              <Card key={person.id} className="text-center">
                <CardContent className="p-4">
                  <img
                    src={person.profile_path 
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                      : '/api/placeholder/150/225'
                    }
                    alt={person.name}
                    className="w-full h-32 object-cover rounded-lg mb-2"
                  />
                  <p className="font-medium text-sm">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Similar Movies */}
      {similarMovies.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Similar Movies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarMovies.map((similarMovie) => (
              <Link key={similarMovie.id} to={`/movie/${similarMovie.id}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={similarMovie.poster_path 
                          ? `https://image.tmdb.org/t/p/w300${similarMovie.poster_path}`
                          : '/api/placeholder/200/300'
                        }
                        alt={similarMovie.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black/70 text-white text-xs">
                          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                          {similarMovie.vote_average?.toFixed(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                        {similarMovie.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(similarMovie.release_date).getFullYear()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;

