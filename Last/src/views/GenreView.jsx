import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useStoreContext } from '../context';
import Header from "./../components/HeaderLog.jsx";
import Genres from "./../components/Genres.jsx";
import Footer from "./../components/Footer.jsx";
import { useParams } from 'react-router-dom';

function GenreLogin() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const { genre_id } = useParams();
  const [selectedGenreId, setSelectedGenreId] = useState(Number(genre_id) || 28);
  const navigate = useNavigate();
  const { cart, fname, addToCart, genres } = useStoreContext();
  
  const cartAdd = (movie) => {
    if (cart.has(movie.id)) {
      alert("This movie is already in your cart.");
    } else {
      addToCart(movie);
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
  }, [selectedGenreId]);
  useEffect(() => {
  if (genre_id) {
    setSelectedGenreId(Number(genre_id));
  }
}, [genre_id]);

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
          <Genres genresList={Array.from(genres)} onGenreClick={handleGenreClick} />
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
                {cart.has(movie.id) ? "Added" : "Buy"}
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
