// =============================================
// components/MovieCard.jsx
// =============================================
// Reusable card shown in grids and scroll rows.
// Props:
//   movie   — TMDB movie object
//   onAdd   — callback when user clicks "Add to Watchlist"
//   onView  — callback when user clicks "View Details" (optional)
//   showWatchedBadge — show green "Watched" badge if true
//   isWatched — whether movie is marked as watched

import { useNavigate } from 'react-router-dom';
import { posterUrl } from '../api/tmdb';
import { isInWatchlist } from '../utils/storage';

// Fallback image if poster is missing
const FALLBACK_IMG = 'https://via.placeholder.com/300x450/1a1a26/9090b0?text=No+Poster';

function MovieCard({ movie, onAdd, showWatchedBadge = false, isWatched = false }) {
  const navigate = useNavigate();

  // Get the release year from release_date (e.g. "2023-07-12" → "2023")
  const year = movie.release_date ? movie.release_date.slice(0, 4) : 'N/A';

  // Format rating to 1 decimal place
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';

  // Build the poster image URL
  const poster = posterUrl(movie.poster_path) || FALLBACK_IMG;

  const handleViewDetails = () => {
    navigate(`/movie/${movie.id}`);
  };

  const inWatchlist = isInWatchlist(movie.id);

  return (
    <div className="movie-card">
      {/* Poster area */}
      <div className="movie-card__poster">
        <img
          src={poster}
          alt={movie.title}
          onError={(e) => { e.target.src = FALLBACK_IMG; }} // fallback if image fails
        />

        {/* Rating badge (top right) */}
        <div className="movie-card__rating-badge">
          ⭐ {rating}
        </div>

        {/* Watched badge (top left) — only shown on watchlist page */}
        {showWatchedBadge && isWatched && (
          <div className="movie-card__watched-badge">✓ Watched</div>
        )}

        {/* Hover overlay with quick action buttons */}
        <div className="movie-card__overlay">
          <div className="movie-card__actions">
            <button className="movie-card__btn movie-card__btn--primary" onClick={handleViewDetails}>
              Details
            </button>
            {onAdd && (
              <button
                className="movie-card__btn movie-card__btn--secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd(movie);
                }}
                disabled={inWatchlist}
              >
                {inWatchlist ? '✓ Added' : '+ List'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="movie-card__body" onClick={handleViewDetails}>
        <div className="movie-card__title" title={movie.title}>
          {movie.title}
        </div>
        <div className="movie-card__meta">
          <span className="movie-card__year">{year}</span>
          <span className="movie-card__rating">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
