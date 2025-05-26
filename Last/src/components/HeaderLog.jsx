import { useNavigate } from "react-router-dom";
import "./../components/HeaderLog.css";
import { useStoreContext } from '../context';
import React, { useState, useCallback } from "react";

function Header() {
  const navigate = useNavigate();
  const { fname } = useStoreContext();
  const [message, setMessage] = useState("");

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  const handleSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        navigate(`/movies/search?query=${encodeURIComponent(query)}`);
      }
    }, 400),
    [navigate]
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch(message);
    }
  };

  return (
    <div>
      <div className="menu"></div>
      <h1 className="title">Poorflix</h1>
      <h1 className="welcome">Hello {fname}!</h1>
      <button className="cart" onClick={() => navigate('/cart')}>Cart</button>
      <button className="settings" onClick={() => navigate('/settings')}>Settings</button>
      <button className="logout" onClick={() => navigate('/')}>Logout</button>
      <div className="searchbar">
        <div className="mess">
          <input
            type="text"
            placeholder="Search..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}

export default Header;
