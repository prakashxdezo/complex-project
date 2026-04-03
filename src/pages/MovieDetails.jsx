// =============================================
// pages/MovieDetails.jsx
// =============================================
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails, posterUrl, backdropUrl, profileUrl } from '../api/tmdb';
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist,
  addRating,
  getMovieRating,
} from '../utils/storage';
import MovieCard from '../components/MovieCard';
import RatingStars from '../components/RatingStars';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

const FALLBACK_POSTER = 'https://via.placeholder.com/400x600/1a1a26/9090b0?text=No+Poster';
const FALLBACK_PROFILE = 'https://via.placeholder.com/100x120/1a1a26/9090b0?text=?';

function MovieDetails() {
  const { id } = useParams(); // Get movie id from URL like /movie/123
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Track watchlist and rating status in local state so UI updates instantly
  const [inWatchlist, setInWatchlist] = useState(false);
  const [userRating, setUserRating] = useState(null);

  // Fetch movie details when the id changes
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0); // Scroll to top when navigating to a new movie
        const data = await getMovieDetails(id);
        setMovie(data);

        // Check watchlist and ratings from localStorage
        setInWatchlist(isInWatchlist(Number(id)));
        setUserRating(getMovieRating(Number(id)));
      } catch (err) {
        setError('Failed to load movie details.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  const handleToggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
      setInWatchlist(false);
      setToast({ message: 'Removed from watchlist', type: 'error' });
    } else {
      addToWatchlist(movie);
      setInWatchlist(true);
      setToast({ message: 'Added to watchlist!', type: 'success' });
    }
  };

  const handleRate = (rating) => {
    addRating(movie, rating);
    setUserRating(rating);
    setToast({ message: `Rated ${rating}/10!`, type: 'success' });
  };

  // Find a YouTube trailer from the videos list
  const getTrailerKey = () => {
    if (!movie?.videos?.results) return null;
    const trailer = movie.videos.results.find(
      (v) => v.type === 'Trailer' && v.site === 'YouTube'
    );
    return trailer?.key || null;
  };

  const trailerKey = movie ? getTrailerKey() : null;

  // Get top 10 cast members
  const cast = movie?.credits?.cast?.slice(0, 10) || [];

  // Get similar movies
  const similar = movie?.similar?.results?.slice(0, 6) || [];

  // Runtime in hours and minutes
  const formatRuntime = (mins) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  if (loading) return <div className="page-wrapper"><Loader text="Loading movie..." /></div>;
  if (error) return (
    <div className="page-wrapper" style={{ padding: '60px 24px' }}>
      <div className="container">
        <div className="error-box">{error}</div>
        <button className="btn btn-ghost" style={{ marginTop: '16px' }} onClick={() => navigate(-1)}>
          ← Go Back
        </button>
      </div>
    </div>
  );
  if (!movie) return null;

  return (
    <div className="page-wrapper">
      {/* ===== HERO (Backdrop + Poster + Info) ===== */}
      <div className="detail-hero">
        {/* Backdrop image */}
        <div className="detail-hero__backdrop">
          {backdropUrl(movie.backdrop_path) && (
            <img src={backdropUrl(movie.backdrop_path)} alt={movie.title} />
          )}
        </div>
        <div className="detail-hero__overlay" />

        <div className="detail-hero__content">
          {/* Poster */}
          <div className="detail-poster">
            <img
              src={posterUrl(movie.poster_path) || FALLBACK_POSTER}
              alt={movie.title}
              onError={(e) => { e.target.src = FALLBACK_POSTER; }}
            />
          </div>

          {/* Info */}
          <div className="detail-info">
            {/* Back button */}
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Back
            </button>

            {/* Title */}
            <h1 className="detail-info__title">{movie.title}</h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="detail-info__tagline">"{movie.tagline}"</p>
            )}

            {/* Meta info */}
            <div className="detail-info__meta">
              {/* TMDB rating */}
              <div className="detail-rating-badge">
                ⭐ {movie.vote_average?.toFixed(1)} / 10
              </div>
              {movie.release_date && (
                <span className="detail-info__meta-item">
                  📅 {movie.release_date}
                </span>
              )}
              {movie.runtime && (
                <span className="detail-info__meta-item">
                  ⏱ {formatRuntime(movie.runtime)}
                </span>
              )}
              {movie.vote_count && (
                <span className="detail-info__meta-item">
                  👥 {movie.vote_count.toLocaleString()} votes
                </span>
              )}
            </div>

            {/* Genres */}
            <div className="detail-info__genres">
              {movie.genres?.map((g) => (
                <span key={g.id} className="detail-genre-tag">{g.name}</span>
              ))}
            </div>

            {/* Action buttons */}
            <div className="detail-info__actions">
              <button
                className={`btn ${inWatchlist ? 'btn-danger' : 'btn-primary'}`}
                onClick={handleToggleWatchlist}
              >
                {inWatchlist ? '✕ Remove from Watchlist' : '+ Add to Watchlist'}
              </button>
              {userRating && (
                <span className="btn btn-success" style={{ cursor: 'default' }}>
                  ⭐ Your Rating: {userRating}/10
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== DETAIL BODY ===== */}
      <div className="container">
        <div className="detail-body">

          {/* Overview */}
          <div className="detail-section">
            <h2 className="detail-section-title">Overview</h2>
            <p className="detail-overview">
              {movie.overview || 'No overview available.'}
            </p>
          </div>

          {/* User Rating */}
          <div className="detail-section">
            <h2 className="detail-section-title">Rate This Movie</h2>
            <div className="user-rating-box">
              <h3>How would you rate this?</h3>
              <RatingStars
                rating={userRating || 0}
                onRate={handleRate}
                readonly={false}
              />
              {userRating && (
                <p className="current-rating">
                  Your rating: <strong>{userRating}/10</strong>
                  <button
                    style={{
                      marginLeft: '12px',
                      fontSize: '12px',
                      color: 'var(--accent)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleRate(0)}
                  >
                    Clear
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* Trailer */}
          <div className="detail-section">
            <h2 className="detail-section-title">Trailer</h2>
            {trailerKey ? (
              <div className="trailer-embed">
                <iframe
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title={`${movie.title} Trailer`}
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="no-trailer">🎬 No trailer available</div>
            )}
          </div>

          {/* Cast */}
          {cast.length > 0 && (
            <div className="detail-section">
              <h2 className="detail-section-title">Cast</h2>
              <div className="cast-grid">
                {cast.map((person) => (
                  <div key={person.id} className="cast-card">
                    <div className="cast-card__img">
                      <img
                        src={profileUrl(person.profile_path) || FALLBACK_PROFILE}
                        alt={person.name}
                        onError={(e) => { e.target.src = FALLBACK_PROFILE; }}
                      />
                    </div>
                    <div className="cast-card__body">
                      <div className="cast-card__name">{person.name}</div>
                      <div className="cast-card__character">{person.character}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movie Details Table */}
          <div className="detail-section">
            <h2 className="detail-section-title">Details</h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              {[
                { label: 'Status', value: movie.status },
                { label: 'Original Language', value: movie.original_language?.toUpperCase() },
                { label: 'Budget', value: movie.budget ? `$${(movie.budget / 1e6).toFixed(1)}M` : 'N/A' },
                { label: 'Revenue', value: movie.revenue ? `$${(movie.revenue / 1e6).toFixed(1)}M` : 'N/A' },
                { label: 'Popularity', value: movie.popularity?.toFixed(1) },
                { label: 'Vote Count', value: movie.vote_count?.toLocaleString() },
              ].map((item) => item.value && item.value !== 'N/A' && (
                <div key={item.label} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '16px',
                }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontWeight: '600', fontSize: '15px' }}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Movies */}
          {similar.length > 0 && (
            <div className="detail-section">
              <h2 className="detail-section-title">Similar Movies</h2>
              <div className="movies-grid">
                {similar.map((m) => (
                  <MovieCard key={m.id} movie={m} onAdd={(movie) => {
                    addToWatchlist(movie);
                    setToast({ message: `"${movie.title}" added!`, type: 'success' });
                  }} />
                ))}
              </div>
            </div>
          )}

        </div>
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

export default MovieDetails;
