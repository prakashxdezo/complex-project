// =============================================
// pages/Movies.jsx
// =============================================
import { useState, useEffect } from 'react';
import { discoverMovies, getGenres } from '../api/tmdb';
import { addToWatchlist } from '../utils/storage';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

// Sort options for the dropdown
const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'title.asc', label: 'Title A–Z' },
];

// Rating filter options
const RATING_OPTIONS = [
  { value: '', label: 'Any Rating' },
  { value: '9', label: '9+ ⭐' },
  { value: '8', label: '8+ ⭐' },
  { value: '7', label: '7+ ⭐' },
  { value: '6', label: '6+ ⭐' },
];

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState(null);

  // Filter states
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [sortBy, setSortBy] = useState('popularity.desc');

  // Fetch genres once on mount
  useEffect(() => {
    getGenres().then((data) => setGenres(data.genres || [])).catch(console.error);
  }, []);

  // Fetch movies whenever filters or page changes
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);

        // Build filter params for the API
        const params = { sort_by: sortBy, page };
        if (selectedGenre) params.with_genres = selectedGenre;
        if (selectedYear) {
          params.primary_release_date_gte = `${selectedYear}-01-01`;
          params.primary_release_date_lte = `${selectedYear}-12-31`;
        }
        if (selectedRating) params['vote_average.gte'] = selectedRating;

        const data = await discoverMovies(params);
        
        // If page > 1, append to existing movies (Load More)
        if (page === 1) {
          setMovies(data.results || []);
        } else {
          setMovies((prev) => [...prev, ...(data.results || [])]);
        }
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        setError('Failed to load movies. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre, selectedYear, selectedRating, sortBy, page]);

  // When filters change, reset to page 1
  const handleFilterChange = (setter, value) => {
    setter(value);
    setPage(1); // Go back to page 1 when filter changes
  };

  // Reset all filters
  const resetFilters = () => {
    setSelectedGenre('');
    setSelectedYear('');
    setSelectedRating('');
    setSortBy('popularity.desc');
    setPage(1);
  };

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie);
    setToast({ message: `"${movie.title}" added!`, type: 'success' });
  };

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Page Header */}
        <div className="movies-page-header">
          <h1>🎬 Browse Movies</h1>
          <p>Discover thousands of movies from every genre and era</p>
        </div>

        {/* ===== FILTER BAR ===== */}
        <div className="filters-bar">
          {/* Genre dropdown */}
          <div className="form-group">
            <label className="form-label">Genre</label>
            <select
              className="form-select"
              value={selectedGenre}
              onChange={(e) => handleFilterChange(setSelectedGenre, e.target.value)}
            >
              <option value="">All Genres</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Year input */}
          <div className="form-group">
            <label className="form-label">Year</label>
            <input
              type="number"
              className="form-input"
              placeholder="e.g. 2023"
              min="1900"
              max={new Date().getFullYear()}
              value={selectedYear}
              onChange={(e) => handleFilterChange(setSelectedYear, e.target.value)}
            />
          </div>

          {/* Rating filter */}
          <div className="form-group">
            <label className="form-label">Min Rating</label>
            <select
              className="form-select"
              value={selectedRating}
              onChange={(e) => handleFilterChange(setSelectedRating, e.target.value)}
            >
              {RATING_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Sort by */}
          <div className="form-group">
            <label className="form-label">Sort By</label>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Reset button */}
          <button className="reset-btn" onClick={resetFilters}>
            ↺ Reset
          </button>
        </div>

        {/* Error state */}
        {error && <div className="error-box" style={{ marginBottom: '24px' }}>{error}</div>}

        {/* Loading first page */}
        {loading && page === 1 && <Loader />}

        {/* Movies Grid */}
        {!loading || page > 1 ? (
          <>
            <div className="movies-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onAdd={handleAddToWatchlist}
                />
              ))}
            </div>

            {/* Empty state */}
            {movies.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-state__icon">🎬</div>
                <h2>No Movies Found</h2>
                <p>Try adjusting your filters</p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Clear Filters
                </button>
              </div>
            )}

            {/* Loading spinner for Load More */}
            {loading && page > 1 && (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div className="loader" style={{ margin: '0 auto' }} />
              </div>
            )}

            {/* Load More button */}
            {movies.length > 0 && page < totalPages && !loading && (
              <div className="load-more-area">
                <button className="btn btn-ghost btn-lg" onClick={handleLoadMore}>
                  Load More Movies
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default Movies;
