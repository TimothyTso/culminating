import React, { useState, useCallback } from "react";
import { Outlet } from "react-router-dom";
import "./../views/MoviesView.css";

function MoviesView() {
  const [message, setMessage] = useState("");

  function debounce(func, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      setMessage("");
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }

  const handleSearch = useCallback(
    debounce(() => {
      setMessage("Fetching API...");
    }, 400),
    []
  );

  return (
      <div className="appcontainer">
        <Outlet />     
      </div>
  );
}

export default MoviesView;
