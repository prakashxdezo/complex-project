// =============================================
// pages/Watchlist.jsx
// =============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getWatchlist,
  removeFromWatchlist,
  toggleWatched,
} from '../utils/storage';
import { posterUrl } from '../api/tmdb';
import Toast from '../components/Toast';

const FALLBACK = 'https://via.placeholder.com/60x90/1a1a26/9090b0?text=?';

// Tabs to filter watchlist view
const TABS = [
  { key: 'all', label: 'All' },
  { key: 'unwatched', label: 'To Watch' },
  { key: 'watched', label: 'Watched' },
];

function Watchlist() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [toast, setToast] = useState(null);

  // Load watchlist from localStorage on mount
  useEffect(() => {
    setWatchlist(getWatchlist());
  }, []);

  // Refresh watchlist from storage after any change
  const refreshList = () => setWatchlist(getWatchlist());

  const handleRemove = (movie) => {
    removeFromWatchlist(movie.id);
    refreshList();
    setToast({ message: `"${movie.title}" removed`, type: 'error' });
  };

  const handleToggleWatched = (movie) => {
    toggleWatched(movie.id);
    refreshList();
    const isNowWatched = !movie.watched;
    setToast({
      message: isNowWatched ? `"${movie.title}" marked as watched!` : `"${movie.title}" unmarked`,
      type: 'success',
    });
  };

  // Filter by tab
  const displayList = watchlist.filter((m) => {
    if (activeTab === 'watched') return m.watched;
    if (activeTab === 'unwatched') return !m.watched;
    return true;
  });

  const watchedCount = watchlist.filter((m) => m.watched).length;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="watchlist-page-header">
          <div>
            <h1>📋 Watchlist</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>
              {watchlist.length} movies · {watchedCount} watched
            </p>
          </div>

          {/* Tab filter */}
          <div className="watchlist-tabs">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                className={`watchlist-tab ${activeTab === tab.key ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
                {tab.key === 'all' && ` (${watchlist.length})`}
                {tab.key === 'unwatched' && ` (${watchlist.length - watchedCount})`}
                {tab.key === 'watched' && ` (${watchedCount})`}
              </button>
            ))}
          </div>
        </div>

        {/* Empty state */}
        {watchlist.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h2>Your Watchlist is Empty</h2>
            <p>Browse movies and add them to keep track of what you want to watch</p>
            <button className="btn btn-primary" onClick={() => navigate('/movies')}>
              Browse Movies
            </button>
          </div>
        )}

        {/* Filtered empty state */}
        {watchlist.length > 0 && displayList.length === 0 && (
          <div className="empty-state">
            <div className="empty-state__icon">
              {activeTab === 'watched' ? '✅' : '🎬'}
            </div>
            <h2>
              {activeTab === 'watched'
                ? 'No watched movies yet'
                : 'Nothing to watch'}
            </h2>
            <p>
              {activeTab === 'watched'
                ? 'Mark movies as watched to see them here'
                : 'All movies are watched!'}
            </p>
          </div>
        )}

        {/* Watchlist items */}
        {displayList.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {displayList.map((movie) => (
              <WatchlistItem
                key={movie.id}
                movie={movie}
                onRemove={handleRemove}
                onToggleWatched={handleToggleWatched}
                onViewDetails={() => navigate(`/movie/${movie.id}`)}
              />
            ))}
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

// ===========================
// Individual watchlist item row
// ===========================
function WatchlistItem({ movie, onRemove, onToggleWatched, onViewDetails }) {
  const year = movie.release_date?.slice(0, 4) || '';
  const poster = movie.poster_path
    ? posterUrl(movie.poster_path, 'w92')
    : FALLBACK;

  return (
    <div className="rated-movie-item">
      {/* Poster thumbnail */}
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
          {movie.watched && (
            <span style={{
              marginLeft: '8px',
              fontSize: '11px',
              background: 'rgba(46,204,113,0.15)',
              color: '#2ecc71',
              padding: '2px 7px',
              borderRadius: '4px',
              fontWeight: '600',
            }}>
              ✓ Watched
            </span>
          )}
        </div>
        <div className="rated-movie-item__year">{year}</div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Added {new Date(movie.addedAt).toLocaleDateString()}
        </div>
      </div>

      {/* TMDB Rating */}
      <div style={{
        fontSize: '14px',
        color: 'var(--gold)',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        minWidth: '60px',
      }}>
        ⭐ {movie.vote_average?.toFixed(1) || 'N/A'}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <button
          className={`btn btn-sm ${movie.watched ? 'btn-ghost' : 'btn-success'}`}
          onClick={() => onToggleWatched(movie)}
        >
          {movie.watched ? 'Unmark' : '✓ Watched'}
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => onRemove(movie)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default Watchlist;
