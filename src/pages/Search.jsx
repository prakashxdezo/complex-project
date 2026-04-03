// =============================================
// pages/Search.jsx
// =============================================
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/tmdb';
import { addToWatchlist } from '../utils/storage';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [toast, setToast] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // If there's an initial query in the URL, search on mount
  useEffect(() => {
    if (initialQuery.trim()) {
      performSearch(initialQuery.trim());
    }
  }, []); // only on mount

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setHasSearched(true);

      const data = await searchMovies(searchQuery);
      setResults(data.results || []);
      setTotalResults(data.total_results || 0);

      // Update URL so user can share/bookmark search
      setSearchParams({ q: searchQuery });
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press in search box
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      performSearch(query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
    setSearchParams({});
  };

  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie);
    setToast({ message: `"${movie.title}" added!`, type: 'success' });
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Search hero */}
        <div className="search-hero">
          <h1>🔍 Search Movies</h1>
          <p>Find any movie in the TMDB database</p>

          {/* Search input */}
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for a movie..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {query && (
              <button className="search-clear" onClick={handleClear}>✕</button>
            )}
          </div>

          {/* Search button */}
          <button
            className="btn btn-primary"
            style={{ marginTop: '16px' }}
            onClick={() => performSearch(query)}
            disabled={!query.trim() || loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Error */}
        {error && <div className="error-box" style={{ marginBottom: '24px' }}>{error}</div>}

        {/* Loading */}
        {loading && <Loader text="Searching..." />}

        {/* Results */}
        {!loading && hasSearched && (
          <>
            {/* Results header */}
            <div className="search-results-header">
              {results.length > 0 ? (
                <p>
                  Found <strong>{totalResults.toLocaleString()}</strong> results
                  {query && <> for "<strong>{query}</strong>"</>}
                </p>
              ) : null}
            </div>

            {/* Results grid */}
            {results.length > 0 ? (
              <div className="movies-grid">
                {results.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onAdd={handleAddToWatchlist}
                  />
                ))}
              </div>
            ) : (
              /* No results */
              <div className="no-results">
                <div className="no-results__icon">🎬</div>
                <h3>No movies found</h3>
                <p>Try a different search term</p>
              </div>
            )}
          </>
        )}

        {/* Initial state (before searching) */}
        {!hasSearched && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍿</div>
            <p>Type a movie title and press Enter or click Search</p>
          </div>
        )}
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

export default Search;
