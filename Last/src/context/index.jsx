import { createContext, useState, useContext } from "react";
import { Map } from 'immutable';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [email, setEmail] = useState("");
  const [fname, setFirst] = useState("");
  const [lname, setLast] = useState("");
  const [password, setPassword] = useState('');
  const [cart, setCart] = useState(Map());
  const [genres, setGenres] = useState(new Map());  

  const addGenre = (genre) => {
    setGenres((prevGenres) => prevGenres.set(genre.id, genre.name));  
  };

  const removeGenre = (genreId) => {
    setGenres((prevGenres) => prevGenres.delete(genreId)); 
  };

  const addToCart = (movie) => {
    setCart(prevCart => prevCart.set(movie.id, movie)); 
  };

  return (
    <StoreContext.Provider value={{
      email, setEmail, cart, setCart,
      fname, setFirst, lname, setLast, password, setPassword,
      addToCart, genres, setGenres, addGenre, removeGenre 
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  return useContext(StoreContext);
};
