
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWatchlist, getRatedMoviesList } from '../utils/storage';
import { posterUrl } from '../api/tmdb';

const FALLBACK = 'https://via.placeholder.com/60x90/1a1a26/9090b0?text=?';

function Admin() {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    setWatchlist(getWatchlist());
    setRatings(getRatedMoviesList());
  }, []);

  // Derived stats
  const watchedCount = watchlist.filter((m) => m.watched).length;
  const unwatchedCount = watchlist.length - watchedCount;
  const avgRating = ratings.length > 0
    ? (ratings.reduce((s, r) => s + r.rating, 0) / ratings.length).toFixed(1)
    : 0;

  const ratingDist = [10, 8, 6, 4, 2].map((score) => ({
    label: `${score - 1}–${score}`,
    count: ratings.filter((r) => r.rating >= score - 1 && r.rating <= score).length,
  }));
  const maxDist = Math.max(...ratingDist.map((d) => d.count), 1);

 
  const recentActivity = [
    ...watchlist.map((m) => ({ ...m, action: 'watchlist', date: m.addedAt })),
    ...ratings.map((m) => ({ ...m, action: 'rated', date: m.ratedAt })),
  ]
    .sort((a, b) => b.date - a.date)
    .slice(0, 8);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-badge">⚙️ Admin Panel</div>
          <h1>Dashboard</h1>
          <p>Your personal CineScope activity overview</p>
        </div>

        {/* ===== STATS CARDS ===== */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-card__icon">📋</div>
            <div className="stat-card__value">{watchlist.length}</div>
            <div className="stat-card__label">Total Watchlist</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">✅</div>
            <div className="stat-card__value">{watchedCount}</div>
            <div className="stat-card__label">Movies Watched</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">🎬</div>
            <div className="stat-card__value">{unwatchedCount}</div>
            <div className="stat-card__label">Yet to Watch</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">⭐</div>
            <div className="stat-card__value">{ratings.length}</div>
            <div className="stat-card__label">Movies Rated</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">📊</div>
            <div className="stat-card__value">{avgRating}</div>
            <div className="stat-card__label">Avg Rating</div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">🏆</div>
            <div className="stat-card__value">
              {ratings.filter((r) => r.rating >= 8).length}
            </div>
            <div className="stat-card__label">Rated 8 or Above</div>
          </div>
        </div>

        {/* ===== ADMIN CARDS GRID ===== */}
        <div className="admin-grid">

          {/* Rating Distribution Chart */}
          <div className="admin-card">
            <h3>Rating Distribution</h3>
            {ratings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                No ratings yet. Rate some movies!
              </p>
            ) : (
              <div className="rating-dist-bar">
                {ratingDist.map((d) => (
                  <div key={d.label} className="rating-dist-row">
                    <span className="label">{d.label}</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ width: `${(d.count / maxDist) * 100}%` }}
                      />
                    </div>
                    <span className="count">{d.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Watchlist Progress */}
          <div className="admin-card">
            <h3>Watchlist Progress</h3>
            {watchlist.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                Your watchlist is empty.
              </p>
            ) : (
              <>
                {/* Progress bar */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    color: 'var(--text-muted)',
                    marginBottom: '8px',
                  }}>
                    <span>Watched</span>
                    <span>{watchedCount} / {watchlist.length}</span>
                  </div>
                  <div style={{
                    height: '10px',
                    background: 'var(--bg-hover)',
                    borderRadius: '5px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${watchlist.length > 0 ? (watchedCount / watchlist.length) * 100 : 0}%`,
                      background: '#2ecc71',
                      borderRadius: '5px',
                      transition: 'width 0.6s ease',
                    }} />
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginTop: '6px',
                  }}>
                    {watchlist.length > 0
                      ? `${Math.round((watchedCount / watchlist.length) * 100)}% complete`
                      : '0% complete'}
                  </div>
                </div>

                {/* Quick stats */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{
                    flex: 1,
                    background: 'rgba(46,204,113,0.1)',
                    border: '1px solid rgba(46,204,113,0.2)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '22px', fontWeight: '700', color: '#2ecc71' }}>{watchedCount}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Watched</div>
                  </div>
                  <div style={{
                    flex: 1,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '12px',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '22px', fontWeight: '700' }}>{unwatchedCount}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Remaining</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Top Rated by Me */}
          <div className="admin-card">
            <h3>My Top Rated</h3>
            {ratings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                No ratings yet.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...ratings]
                  .sort((a, b) => b.rating - a.rating)
                  .slice(0, 5)
                  .map((movie, i) => (
                    <div
                      key={movie.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        cursor: 'pointer',
                        padding: '6px',
                        borderRadius: '8px',
                        transition: 'background 0.2s',
                      }}
                      onClick={() => navigate(`/movie/${movie.id}`)}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '20px',
                        color: 'var(--text-muted)',
                        width: '20px',
                        textAlign: 'center',
                      }}>
                        {i + 1}
                      </span>
                      <img
                        src={movie.poster_path ? posterUrl(movie.poster_path, 'w92') : FALLBACK}
                        alt={movie.title}
                        style={{ width: '36px', height: '54px', objectFit: 'cover', borderRadius: '4px' }}
                        onError={(e) => { e.target.src = FALLBACK; }}
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}>
                          {movie.title}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {movie.release_date?.slice(0, 4)}
                        </div>
                      </div>
                      <span style={{
                        color: 'var(--gold)',
                        fontWeight: '700',
                        fontSize: '15px',
                      }}>
                        {movie.rating}/10
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="admin-card">
            <h3>Recent Activity</h3>
            {recentActivity.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
                No activity yet. Start adding movies!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentActivity.map((item, i) => (
                  <div
                    key={`${item.action}-${item.id}-${i}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '8px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/movie/${item.id}`)}
                  >
                    <span style={{ fontSize: '18px' }}>
                      {item.action === 'rated' ? '⭐' : item.watched ? '✅' : '📋'}
                    </span>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {item.action === 'rated'
                          ? `Rated ${item.rating}/10`
                          : item.watched ? 'Marked as watched' : 'Added to watchlist'}
                        {' · '}
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Quick Links */}
        <div style={{
          marginTop: '32px',
          padding: '24px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '16px',
          }}>
            Quick Links
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button className="btn btn-ghost" onClick={() => navigate('/movies')}>
              🎬 Browse Movies
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/watchlist')}>
              📋 My Watchlist
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/ratings')}>
              ⭐ My Ratings
            </button>
            <button className="btn btn-ghost" onClick={() => navigate('/search')}>
              🔍 Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
