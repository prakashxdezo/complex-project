// =============================================
// pages/NotFound.jsx
// =============================================
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="page-wrapper">
      <div className="container">
        <div className="empty-state" style={{ paddingTop: '120px' }}>
          <div className="empty-state__icon">🎬</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', letterSpacing: '2px' }}>
            404 — Scene Not Found
          </h2>
          <p>The page you're looking for doesn't exist.</p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
