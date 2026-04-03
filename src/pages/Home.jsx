// =============================================
// pages/Home.jsx
// =============================================
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getPopularMovies,
  getNowPlaying,
  getTopRated,
  getUpcoming,
  getGenres,
  posterUrl,
  backdropUrl,
} from '../api/tmdb';
import { addToWatchlist } from '../utils/storage';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import Toast from '../components/Toast';

function Home() {
  const navigate = useNavigate();

  // State for each section
  const [heroMovie, setHeroMovie] = useState(null);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Fetch all home page data when component mounts
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);

        // Fetch everything in parallel for speed
        const [popularData, nowData, topData, upcomingData, genresData] = await Promise.all([
          getPopularMovies(),
          getNowPlaying(),
          getTopRated(),
          getUpcoming(),
          getGenres(),
        ]);

        setPopular(popularData.results || []);
        setNowPlaying(nowData.results || []);
        setTopRated(topData.results || []);
        setUpcoming(upcomingData.results || []);
        setGenres(genresData.genres || []);

        // Pick a random popular movie for the hero
        const movies = popularData.results || [];
        if (movies.length > 0) {
          const randomIndex = Math.floor(Math.random() * Math.min(5, movies.length));
          setHeroMovie(movies[randomIndex]);
        }
      } catch (err) {
        setError('Failed to load movies. Please check your API key.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Filter popular movies by selected genre
  const filteredMovies = selectedGenre
    ? popular.filter((m) => m.genre_ids?.includes(selectedGenre))
    : popular;

  // Add a movie to watchlist
  const handleAddToWatchlist = (movie) => {
    addToWatchlist(movie);
    setToast({ message: `"${movie.title}" added to watchlist!`, type: 'success' });
  };

  if (loading) return <div className="page-wrapper"><Loader text="Loading CineScope..." /></div>;
  if (error) return (
    <div className="page-wrapper" style={{ padding: '80px 24px' }}>
      <div className="container">
        <div className="error-box">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="page-wrapper">
      {/* ===== HERO SECTION ===== */}
      {heroMovie && (
        <section className="hero">
          <div className="hero__backdrop">
            {backdropUrl(heroMovie.backdrop_path) && (
              <img
                src={backdropUrl(heroMovie.backdrop_path)}
                alt={heroMovie.title}
              />
            )}
          </div>
          <div className="hero__gradient" />

          <div className="container">
            <div className="hero__content">
              <div className="hero__badge">🔥 Featured Movie</div>
              <h1 className="hero__title">{heroMovie.title}</h1>
              <div className="hero__meta">
                <span className="hero__meta-item rating">
                  ⭐ {heroMovie.vote_average?.toFixed(1)} / 10
                </span>
                <span className="hero__meta-item">
                  📅 {heroMovie.release_date?.slice(0, 4)}
                </span>
                <span className="hero__meta-item">
                  👥 {(heroMovie.vote_count || 0).toLocaleString()} votes
                </span>
              </div>
              <p className="hero__overview">{heroMovie.overview}</p>
              <div className="hero__actions">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate(`/movie/${heroMovie.id}`)}
                >
                  ▶ View Details
                </button>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={() => handleAddToWatchlist(heroMovie)}
                >
                  + Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== NOW PLAYING (Horizontal scroll) ===== */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Now Playing</h2>
            <button className="section-link" onClick={() => navigate('/movies')}>
              See All →
            </button>
          </div>
          <div className="scroll-row">
            {nowPlaying.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAdd={handleAddToWatchlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== POPULAR MOVIES + GENRE FILTER ===== */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Popular Movies</h2>
            <button className="section-link" onClick={() => navigate('/movies')}>
              See All →
            </button>
          </div>

          {/* Genre filter pills */}
          <div className="genre-pills" style={{ marginBottom: '28px' }}>
            <button
              className={`genre-pill ${selectedGenre === null ? 'active' : ''}`}
              onClick={() => setSelectedGenre(null)}
            >
              All
            </button>
            {genres.slice(0, 10).map((genre) => (
              <button
                key={genre.id}
                className={`genre-pill ${selectedGenre === genre.id ? 'active' : ''}`}
                onClick={() => setSelectedGenre(
                  selectedGenre === genre.id ? null : genre.id
                )}
              >
                {genre.name}
              </button>
            ))}
          </div>

          {/* Movies grid */}
          <div className="movies-grid">
            {filteredMovies.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAdd={handleAddToWatchlist}
              />
            ))}
          </div>
          {filteredMovies.length === 0 && (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px 0' }}>
              No movies found for this genre.
            </p>
          )}
        </div>
      </section>

      {/* ===== TOP RATED ===== */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Top Rated</h2>
            <button className="section-link" onClick={() => navigate('/movies')}>
              See All →
            </button>
          </div>
          <div className="movies-grid">
            {topRated.slice(0, 8).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAdd={handleAddToWatchlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ===== UPCOMING ===== */}
      <section className="home-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Coming Soon</h2>
          </div>
          <div className="scroll-row">
            {upcoming.slice(0, 12).map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onAdd={handleAddToWatchlist}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Toast notification */}
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

export default Home;
