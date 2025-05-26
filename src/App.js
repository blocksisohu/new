import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const moveX = (mousePosition.x / window.innerWidth) * 50;
  const moveY = (mousePosition.y / window.innerHeight) * 50;

  const handleSearch = () => {
    if (query.trim() !== '') {
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      window.open(googleSearchUrl, '_blank');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container">
      <div
        className="floating-shape"
        style={{ transform: `translate(${moveX}px, ${moveY}px)` }}
      />

      <h1>Gamer Search</h1>

      <div className="search-box">
        <input
          type="text"
          placeholder="ابحث مثل المحترفين..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button onClick={handleSearch}>🔍 بحث</button>
      </div>

      <div className="footer">
        نسخة جيمرز من صفحة Google - تصميم: Spectro 🕹️
      </div>
    </div>
  );
}

export default App;
