// =============================================
// pages/Ratings.jsx
// =============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRatedMoviesList, removeRating } from '../utils/storage';
import { posterUrl } from '../api/tmdb';
import RatingStars from '../components/RatingStars';
import Toast from '../components/Toast';

const FALLBACK = 'https://via.placeholder.com/60x90/1a1a26/9090b0?text=?';

// Sort options for rated movies
const SORT_OPTIONS = [
  { value: 'recent', label: 'Most Recently Rated' },
  { value: 'highest', label: 'Highest Rated' },
  { value: 'lowest', label: 'Lowest Rated' },
  { value: 'title', label: 'Title A–Z' },
];

function Ratings() {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [toast, setToast] = useState(null);

  // Load ratings on mount
  useEffect(() => {
    setRatings(getRatedMoviesList());
  }, []);

  const refreshRatings = () => setRatings(getRatedMoviesList());

  const handleRemoveRating = (movie) => {
    removeRating(movie.id);
    refreshRatings();
    setToast({ message: `Rating removed for "${movie.title}"`, type: 'error' });
  };

  // Sort the list based on selected option
  const sortedRatings = [...ratings].sort((a, b) => {
    if (sortBy === 'recent') return b.ratedAt - a.ratedAt;
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

  // Calculate average rating
  const avgRating = ratings.length > 0
    ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1)
    : null;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div style={{ padding: '40px 0 32px' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '42px',
            letterSpacing: '2px',
            marginBottom: '6px'
          }}>
            ⭐ My Ratings
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Movies you've rated
          </p>
        </div>

        {/* Stats bar */}
        {ratings.length > 0 && (
          <div className="stats-row" style={{ marginBottom: '32px' }}>
            <div className="stat-card">
              <div className="stat-card__icon">🎬</div>
              <div className="stat-card__value">{ratings.length}</div>
              <div className="stat-card__label">Movies Rated</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon">⭐</div>
              <div className="stat-card__value">{avgRating}</div>
              <div className="stat-card__label">Average Rating</div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon">🏆</div>
              <div className="stat-card__value">
                {ratings.filter((r) => r.rating >= 8).length}
              </div>
              <div className="stat-card__label">Rated 8+</div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {ratings.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">⭐</div>
            <h2>No Ratings Yet</h2>
            <p>Go to a movie page and rate it using the stars!</p>
            <button className="btn btn-primary" onClick={() => navigate('/movies')}>
              Browse Movies
            </button>
          </div>
        )}

        {/* Sort + List */}
        {ratings.length > 0 && (
          <>
            {/* Sort dropdown */}
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginBottom: '20px',
            }}>
              <div className="form-group" style={{ width: '220px' }}>
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ratings list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sortedRatings.map((movie) => (
                <RatedMovieItem
                  key={movie.id}
                  movie={movie}
                  onRemove={handleRemoveRating}
                  onViewDetails={() => navigate(`/movie/${movie.id}`)}
                />
              ))}
            </div>
          </>
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

// ===========================
// Individual rated movie row
// ===========================
function RatedMovieItem({ movie, onRemove, onViewDetails }) {
  const year = movie.release_date?.slice(0, 4) || '';
  const poster = movie.poster_path
    ? posterUrl(movie.poster_path, 'w92')
    : FALLBACK;

  return (
    <div className="rated-movie-item">
      {/* Poster */}
      <div className="rated-movie-item__poster" style={{ cursor: 'pointer' }} onClick={onViewDetails}>
        <img
          src={poster}
          alt={movie.title}
          onError={(e) => { e.target.src = FALLBACK; }}
        />
      </div>

      {/* Info */}
      <div className="rated-movie-item__info">
        <div
          className="rated-movie-item__title"
          style={{ cursor: 'pointer' }}
          onClick={onViewDetails}
        >
          {movie.title}
        </div>
        <div className="rated-movie-item__year">{year}</div>
        <div className="rated-movie-item__rating">
          {/* Show stars (readonly) */}
          <RatingStars rating={movie.rating} readonly />
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
          Rated on {new Date(movie.ratedAt).toLocaleDateString()}
        </div>
      </div>

      {/* Rating score badge */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        minWidth: '60px',
      }}>
        <div style={{
          fontSize: '24px',
          fontFamily: 'var(--font-display)',
          color: movie.rating >= 8 ? 'var(--gold)' : movie.rating >= 6 ? 'var(--text-primary)' : 'var(--text-muted)',
        }}>
          {movie.rating}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>/ 10</div>
      </div>

      {/* Remove button */}
      <button
        className="btn btn-sm btn-danger"
        onClick={() => onRemove(movie)}
      >
        Remove
      </button>
    </div>
  );
}

export default Ratings;
