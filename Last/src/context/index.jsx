import { createContext, useState, useContext, useEffect } from "react";
import { Map } from 'immutable';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const [cart, setCart] = useState(Map());
  const [genres, setGenres] = useState(new Map());
  const [loading, setLoading] = useState(true);  

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
        const sessionCart = localStorage.getItem(user.uid);
        if (sessionCart) {
          setCart(Map(JSON.parse(sessionCart)));
        }
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user && cart.size > 0) {
      localStorage.setItem(user.uid, JSON.stringify([...cart.entries()]));
    }
  }, [cart, user]); // Whenever cart or user changes, save to localStorage

  if (loading) {
    return <h1>Loading...</h1>;
  }

  const addGenre = (genre) => {
    setGenres((prevGenres) => prevGenres.set(genre.id, genre.name));  
  };

  const removeGenre = (genreId) => {
    setGenres((prevGenres) => prevGenres.delete(genreId)); 
  };

  const addToCart = (movie) => {
    setCart((prevCart) => prevCart.set(movie.id, movie)); 
  };

  return (
    <StoreContext.Provider value={{
      user, setUser,
     
      cart, setCart,
      genres, setGenres, addGenre, removeGenre, addToCart
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  return useContext(StoreContext);
};
