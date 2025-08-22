import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search as SearchIcon, Star, Filter, X } from 'lucide-react';

const API_BASE_URL = 'https://movie-recommendation-app-backend-6nqq.onrender.com';

const Search = () => {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    sortBy: 'popularity.desc',
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch genres on component mount
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/movies/genres/list`);
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const searchMovies = async (searchQuery = query, page = 1, searchFilters = filters) => {
    if (!searchQuery.trim() && !searchFilters.genre && !searchFilters.year) return;

    setLoading(true);
    try {
      let url;
      let params = new URLSearchParams({
        page: page.toString(),
      });

      if (searchQuery.trim()) {
        // Text search
        url = `${API_BASE_URL}/movies/search`;
        params.append('query', searchQuery.trim());
      } else {
        // Discover with filters
        url = `${API_BASE_URL}/movies/discover/movies`;
        if (searchFilters.genre) params.append('with_genres', searchFilters.genre);
        if (searchFilters.year) params.append('primary_release_year', searchFilters.year);
        if (searchFilters.sortBy) params.append('sort_by', searchFilters.sortBy);
      }

      const response = await fetch(`${url}?${params}`);
      const data = await response.json();

      setMovies(data.results || []);
      setTotalPages(data.total_pages || 0);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error searching movies:', error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    searchMovies(query, 1, filters);
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    searchMovies(query, 1, newFilters);
  };

  const clearFilters = () => {
    setFilters({
      genre: '',
      year: '',
      sortBy: 'popularity.desc',
    });
    setQuery('');
    setMovies([]);
    setCurrentPage(1);
    setTotalPages(0);
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      searchMovies(query, currentPage + 1, filters);
    }
  };

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
            <p className="text-xs text-muted-foreground mb-2">
              {new Date(movie.release_date).getFullYear()}
            </p>
            <p className="text-xs text-muted-foreground line-clamp-3">
              {movie.overview}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Discover Movies</h1>
        <p className="text-muted-foreground">
          Search for movies by title or explore by genre and year
        </p>
      </div>

      {/* Search Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search for movies..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <label className="text-sm font-medium mb-2 block">Genre</label>
                  <Select value={filters.genre} onValueChange={(value) => handleFilterChange('genre', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Genres" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Genres</SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre.id} value={genre.id.toString()}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Year</label>
                  <Select value={filters.year} onValueChange={(value) => handleFilterChange('year', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Years</SelectItem>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Sort By</label>
                  <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity.desc">Most Popular</SelectItem>
                      <SelectItem value="popularity.asc">Least Popular</SelectItem>
                      <SelectItem value="vote_average.desc">Highest Rated</SelectItem>
                      <SelectItem value="vote_average.asc">Lowest Rated</SelectItem>
                      <SelectItem value="release_date.desc">Newest</SelectItem>
                      <SelectItem value="release_date.asc">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && movies.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : movies.length > 0 ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>

          {/* Load More */}
          {currentPage < totalPages && (
            <div className="text-center">
              <Button onClick={loadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            </div>
          )}

          {/* Pagination Info */}
          <div className="text-center text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      ) : query || filters.genre || filters.year ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No movies found. Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Start searching to discover amazing movies!</p>
        </div>
      )}
    </div>
  );
};

export default Search;

