import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Calendar, Clock } from 'lucide-react';

const API_BASE_URL = 'https://movie-recommendation-app-backend-6nqq.onrender.com';

const Home = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [popular, topRated, nowPlaying, upcoming] = await Promise.all([
          fetch(`${API_BASE_URL}/movies/popular?page=1`).then(res => res.json()),
          fetch(`${API_BASE_URL}/movies/top-rated?page=1`).then(res => res.json()),
          fetch(`${API_BASE_URL}/movies/now-playing?page=1`).then(res => res.json()),
          fetch(`${API_BASE_URL}/movies/upcoming?page=1`).then(res => res.json()),
        ]);

        setPopularMovies(popular.results?.slice(0, 8) || []);
        setTopRatedMovies(topRated.results?.slice(0, 8) || []);
        setNowPlayingMovies(nowPlaying.results?.slice(0, 8) || []);
        setUpcomingMovies(upcoming.results?.slice(0, 8) || []);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const MovieCard = ({ movie }) => (
    <Link to={`/movie/${movie.id}`}>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            <img
              src={movie.poster_path 
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : '/api/placeholder/300/450'
              }
              alt={movie.title}
              className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {movie.vote_average?.toFixed(1)}
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {movie.title}
            </h3>
            <p className="text-xs text-muted-foreground">
              {new Date(movie.release_date).getFullYear()}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const MovieSection = ({ title, movies, icon: Icon, description }) => (
    <section className="mb-12">
      <div className="flex items-center mb-6">
        <Icon className="h-6 w-6 mr-3 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="text-center py-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Discover Your Next Favorite Movie
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore thousands of movies, create your watchlist, and get personalized recommendations
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/search">
            <Button size="lg" className="w-full sm:w-auto">
              Start Exploring
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Join MovieFlix
            </Button>
          </Link>
        </div>
      </section>

      {/* Movie Sections */}
      <MovieSection
        title="Trending Now"
        movies={popularMovies}
        icon={TrendingUp}
        description="Most popular movies right now"
      />

      <MovieSection
        title="Top Rated"
        movies={topRatedMovies}
        icon={Star}
        description="Highest rated movies of all time"
      />

      <MovieSection
        title="Now Playing"
        movies={nowPlayingMovies}
        icon={Calendar}
        description="Currently in theaters"
      />

      <MovieSection
        title="Coming Soon"
        movies={upcomingMovies}
        icon={Clock}
        description="Upcoming releases to watch out for"
      />
    </div>
  );
};

export default Home;

