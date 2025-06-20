import { useNavigate } from "react-router-dom";
import "./../components/HeaderLog.css";
import { useStoreContext } from '../context';
import React, { useState, useCallback } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { set } from "immutable";

function Header() {
  const navigate = useNavigate();
  const { user, setUser, setCart, cart: contextCart } = useStoreContext();
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
  function logout() {
    if (user) {
      localStorage.removeItem(user.uid);
    }

    signOut(auth)
      .then(() => {
        setUser(null);
        setCart(new Map());

        navigate("/")
        location.reload(); 
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  }
  const handleSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        navigate(`/movies/search?query=${encodeURIComponent(query)}`);
        location.reload();
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
      <h1 className="welcome">Hello {(user.displayName.split(' ')[0] || '')}!</h1>
      <button className="cart" onClick={() => navigate('/cart')}>Cart</button>
      <button
        className="settings"
        onClick={() => {
        navigate('/settings');
        location.reload();
      }}>
        Settings
      </button>

      <button className="logout" onClick={logout}>Logout</button>
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
