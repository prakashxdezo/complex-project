// =============================================
// components/Header.jsx
// =============================================
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="header">
        <div className="header__inner">
          {/* Logo */}
          <NavLink to="/" className="header__logo" onClick={closeMenu}>
            CINE<span>SCOPE</span>
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="header__nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/movies">Movies</NavLink>
            <NavLink to="/watchlist">Watchlist</NavLink>
            <NavLink to="/ratings">Ratings</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>

          {/* Actions */}
          <div className="header__actions">
            <button className="header__search-btn" onClick={handleSearchClick}>
              🔍 Search
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="header__menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Mobile Navigation Dropdown */}
      <nav className={`header__mobile-nav ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" end onClick={closeMenu}>🏠 Home</NavLink>
        <NavLink to="/movies" onClick={closeMenu}>🎬 Movies</NavLink>
        <NavLink to="/search" onClick={closeMenu}>🔍 Search</NavLink>
        <NavLink to="/watchlist" onClick={closeMenu}>📋 Watchlist</NavLink>
        <NavLink to="/ratings" onClick={closeMenu}>⭐ Ratings</NavLink>
        <NavLink to="/admin" onClick={closeMenu}>⚙️ Admin</NavLink>
      </nav>
    </>
  );
}

export default Header;
