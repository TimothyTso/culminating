import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStoreContext } from '../context';
import Header from "./../components/HeaderLog.jsx";
import Genres from "./../components/Genres.jsx";
import Footer from "./../components/Footer.jsx";
import { useParams } from 'react-router-dom';
import { firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function GenreLogin() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [selectedGenreId, setSelectedGenreId] = useState(28);
  const [userGenres, setUserGenres] = useState(new Map());
  const [userName, setUserName] = useState(""); 
  const [userCart, setUserCart] = useState(new Set()); 
  const navigate = useNavigate();
  const { cart, user, addToCart, genres } = useStoreContext();
  
  const cartAdd = (movie) => {
    if (userCart.has(movie.id)) {
      alert("This movie is already in your cart.");
    } else {
      addToCart(movie);
    }
  };

  const readUserData = async () => {
      try {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("User data from Firestore:", data);
  
          if (Array.isArray(data.genres)) {
            setUserGenres(new Map(data.genres.map(genre => [genre.id, genre.name])));
          } else if (data.genres instanceof Object) {
            setUserGenres(new Map(Object.entries(data.genres)));
          }
  
          if (data.firstName && data.lastName) {
            setUserName(`${data.firstName} ${data.lastName}`);
          } else if (user.displayName) {
            setUserName(user.displayName);
          }
  
          if (data.cart) {
            setUserCart(new Set(data.cart.map((movie) => movie.id))); 
          }
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching user data from Firestore: ", error);
      }
    };
    
  useEffect(() => {
    const fetchMovies = async () => {
      const url = selectedGenreId
        ? `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${selectedGenreId}`
        : `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=28`;

      const response = await axios.get(url);
      setMovies(response.data.results);
    };

    fetchMovies();
    if (user && user.uid) {
      readUserData(); 
    }
  }, [selectedGenreId, user]);

  async function getMoviesByPage(page) {
    const response = await axios.get(
      `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${selectedGenreId}&page=${page}`
    );
    setMovies(response.data.results);
  }

  function loadMovie(id) {
    navigate(`/movies/${id}`);
  }

  

  const handleGenreClick = (genreId) => {
    setSelectedGenreId(genreId);
    navigate(`/movies/genre/${genreId}`);
  };

  return (
    <div className="appcontainer">
      <div className="header">
        <Header />
      </div>
      <div className="loginfeat">
        <div className="genrelist">
          <Genres genresList={userGenres.size > 0 ? userGenres : genres} onGenreClick={handleGenreClick} />
          <div className="spacer">
          </div>
          <div className="pageturner">
            <p>
              <a onClick={() => {
                if (page > 1) {
                  setPage(page - 1), getMoviesByPage(page - 1)
                }
              }}>Previous Page<br/></a>
              <a onClick={() => {
                if (page < 50) {
                  setPage(page + 1), getMoviesByPage(page + 1)
                }
              }}>Next Page</a></p>
              
          </div>
        </div>
        <div className="genredisp">
          {movies.slice(0,8).map((movie) => (
            <div>
            <div
              key={movie.id}
              className="moviecard"
              onClick={() => {
                loadMovie(movie.id);
              }}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="movieposter"
              />
              <h3>{movie.title}</h3>
            </div>
            
              <button 
              className="butt"
              onClick={() => cartAdd(movie)}>
                {userCart.has(movie.id)
                    ? "Bought"
                    : (cart.has(movie.id) ? "Added" : "Buy")}
              </button>
              
            </div>
          ))}
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default GenreLogin;
