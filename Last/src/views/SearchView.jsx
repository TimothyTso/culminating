import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from "./../components/HeaderLog.jsx";
import Footer from "./../components/Footer.jsx";
import { useStoreContext } from '../context';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "./SearchView.css";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_KEY;

const SearchView = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('query') || '';
  const pageParam = parseInt(searchParams.get('page')) || 1;

  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userCart, setUserCart] = useState(new Set());
  
  const debounceTimeout = useRef(null);
  const navigate = useNavigate();

  const { cart, addToCart, user } = useStoreContext();

  // Fetch movies based on search
  const fetchResults = async (query, page) => {
    if (!query) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: TMDB_API_KEY,
          query,
          page,
        },
      });

      setResults(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced fetch when search params change
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      fetchResults(queryParam, pageParam);
    }, 500);

    return () => clearTimeout(debounceTimeout.current);
  }, [queryParam, pageParam]);

  // Load user's cart from Firestore
  useEffect(() => {
    const fetchUserCart = async () => {
      if (!user?.uid) return;

      try {
        const docRef = doc(firestore, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.cart) {
            const movieIdSet = new Set(data.cart.map((movie) => movie.id));
            setUserCart(movieIdSet);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user cart:", err);
      }
    };

    fetchUserCart();
  }, [user]);

  const handleInputChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setSearchParams({ query: newQuery, page: 1 });
  };

  const goToPage = (newPage) => {
    setPage(newPage);
    setSearchParams({ query, page: newPage });
  };

  const loadMovie = (id) => {
    navigate(`/movies/${id}`);
    location.reload();
  };

  const cartAdd = (movie) => {
    if (userCart.has(movie.id)) {
      alert("This movie is already in your cart.");
    } else if (cart.has(movie.id)) {
      alert("This movie is already added.");
    } else {
      addToCart(movie);
    }
  };

  return (
    <div className="appcontainer">
      <Header />

      <div className="search-view">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search for a movie..."
          className="searchbar"
        />

        {loading && <p>Loading...</p>}
        {!loading && results.length === 0 && query && <p>No results found.</p>}

        <div className="genredisp2">
          {results.map((movie) => (
            <div key={movie.id}>
              <div className="moviecard" onClick={() => loadMovie(movie.id)}>
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movieposter"
                  />
                ) : (
                  <div><span>No Image</span></div>
                )}
                <h3>{movie.title}</h3>
              </div>

              <button 
                className="butt"
                disabled={userCart.has(movie.id)}
                onClick={() => cartAdd(movie)}
              >
                {userCart.has(movie.id)
                  ? "Bought"
                  : cart.has(movie.id)
                    ? "Added"
                    : "Buy"}
              </button>
            </div>
          ))}
        </div>

        {!loading && totalPages > 1 && (
          <div className="pageturner">
            <p>
              <a onClick={() => page > 1 && goToPage(page - 1)}>Previous Page<br /></a>
              <a onClick={() => page < totalPages && goToPage(page + 1)}>Next Page</a>
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchView;
