// =============================================
// components/Loader.jsx
// =============================================
// Simple spinner shown while data is loading

function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-wrapper">
      <div className="loader" />
      <p className="loader-text">{text}</p>
    </div>
  );
}

export default Loader;
