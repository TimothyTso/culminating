import "./../components/Feature.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function Feature() {
    const [movies, setMovies] = useState([]);
    const randMovie = Math.floor(Math.random() * 12);
    const randPage = Math.floor(Math.random() * 20);
    const apiUrl = `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}&language=en-US&page=` + randPage;

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                setMovies(data.results.slice(randMovie, randMovie + 4)); // random movie then next six
            } catch (error) {
                setError('Failed to fetch movies');
            }};
        fetchMovies();
    }, []);

    return (
        <div className="feature">
            <div className="nplay">
                <h1>Now Playing</h1>
                <p>Check out the latest movies in theaters!</p>
            </div>
            <div className="moviecontainer">
                {movies.map((movie) => {
                    const movieImage = movie.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                        : 'https://via.placeholder.com/500x750?text=No+Image';

                    return (
                        <div className="moviebox" key={movie.id}>
                            <img className="movieposter" src={movieImage} alt={movie.title} />
                            <h3>{movie.title}</h3>
                            <div className="detailbut">
                                <Link to={`/movies/` + movie.id} className="dbutton">Details</Link>
                            </div>
                        </div>
                    )})}
            </div>
        </div>
    )
}

export default Feature;