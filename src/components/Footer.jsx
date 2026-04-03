// =============================================
// components/Footer.jsx
// =============================================
import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        {/* Brand */}
        <div className="footer__brand">
          <h3>CINE<span>SCOPE</span></h3>
          <p>
            Discover, track, and rate your favorite movies.
            Powered by TMDB — your personal movie companion.
          </p>
        </div>

        {/* Discover */}
        <div className="footer__col">
          <h4>Discover</h4>
          <Link to="/">Home</Link>
          <Link to="/movies">All Movies</Link>
          <Link to="/search">Search</Link>
        </div>

        {/* My Library */}
        <div className="footer__col">
          <h4>My Library</h4>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/ratings">My Ratings</Link>
          <Link to="/admin">Dashboard</Link>
        </div>

        {/* TMDB credit */}
        <div className="footer__col">
          <h4>Credits</h4>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer">
            TMDB API
          </a>
          <a href="https://developers.themoviedb.org/" target="_blank" rel="noreferrer">
            API Docs
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer__bottom">
        <span>© {year} CineScope. Built for learning React.</span>
        <div className="footer__tmdb">
          <span>Movie data provided by</span>
          <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer"
            style={{ color: '#01b4e4', fontWeight: 600 }}>
            TMDB
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
