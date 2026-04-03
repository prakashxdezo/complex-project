// =============================================
// components/RatingStars.jsx
// =============================================
// Shows 5 stars (each = 2 points out of 10).
// When readonly=false, user can click to rate.

function RatingStars({ rating = 0, onRate = null, readonly = false }) {
  // Convert 0–10 scale to 0–5 stars
  const stars = Math.round(rating / 2);

  const handleClick = (starIndex) => {
    if (readonly || !onRate) return;
    // starIndex is 1–5, multiply by 2 to get 2–10
    onRate(starIndex * 2);
  };

  return (
    <div className={`rating-stars ${readonly ? 'readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`rating-stars__star ${star <= stars ? 'filled' : 'empty'}`}
          onClick={() => handleClick(star)}
          title={readonly ? `${rating}/10` : `Rate ${star * 2}/10`}
        >
          ★
        </span>
      ))}
      {/* Show numeric rating label */}
      {rating > 0 && (
        <span className="rating-stars__label">
          {typeof rating === 'number' ? rating.toFixed(1) : rating}/10
        </span>
      )}
    </div>
  );
}

export default RatingStars;
