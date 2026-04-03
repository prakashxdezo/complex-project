// =============================================
// utils/storage.js — LocalStorage Helpers
// =============================================
// These simple functions manage watchlist & ratings
// stored in the browser's localStorage.

// ===========================
// WATCHLIST
// ===========================

// Get the full watchlist array from localStorage
export const getWatchlist = () => {
  const data = localStorage.getItem('cinescope_watchlist');
  return data ? JSON.parse(data) : [];
};

// Save the full watchlist back to localStorage
const saveWatchlist = (list) => {
  localStorage.setItem('cinescope_watchlist', JSON.stringify(list));
};

// Add a movie to the watchlist
// movie should have: id, title, poster_path, release_date, vote_average
export const addToWatchlist = (movie) => {
  const list = getWatchlist();
  // Don't add if already in watchlist
  if (list.find((m) => m.id === movie.id)) return;
  const newItem = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    watched: false,           // Track if user has watched it
    addedAt: Date.now(),      // When it was added
  };
  saveWatchlist([...list, newItem]);
};

// Remove a movie from watchlist by id
export const removeFromWatchlist = (movieId) => {
  const list = getWatchlist();
  saveWatchlist(list.filter((m) => m.id !== movieId));
};

// Toggle "watched" status on a watchlist movie
export const toggleWatched = (movieId) => {
  const list = getWatchlist();
  const updated = list.map((m) =>
    m.id === movieId ? { ...m, watched: !m.watched } : m
  );
  saveWatchlist(updated);
};

// Check if a movie is in the watchlist
export const isInWatchlist = (movieId) => {
  const list = getWatchlist();
  return list.some((m) => m.id === movieId);
};

// ===========================
// RATINGS
// ===========================

// Ratings are stored as an object: { movieId: { rating, title, poster_path, ... } }
export const getRatings = () => {
  const data = localStorage.getItem('cinescope_ratings');
  return data ? JSON.parse(data) : {};
};

const saveRatings = (ratings) => {
  localStorage.setItem('cinescope_ratings', JSON.stringify(ratings));
};

// Add or update a rating for a movie
export const addRating = (movie, rating) => {
  const ratings = getRatings();
  ratings[movie.id] = {
    rating,                         // Number from 1–10
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    ratedAt: Date.now(),
  };
  saveRatings(ratings);
};

// Remove a rating by movie id
export const removeRating = (movieId) => {
  const ratings = getRatings();
  delete ratings[movieId];
  saveRatings(ratings);
};

// Get rating for a single movie (returns null if not rated)
export const getMovieRating = (movieId) => {
  const ratings = getRatings();
  return ratings[movieId]?.rating ?? null;
};

// Get all rated movies as an array
export const getRatedMoviesList = () => {
  const ratings = getRatings();
  return Object.values(ratings).sort((a, b) => b.ratedAt - a.ratedAt);
};
