import axios from "axios";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./DetailView.css"
import Header from "./../components/HeaderLog.jsx";
import Footer from "./../components/Footer.jsx";

function DetailMovieView() {
  const [movie, setMovie] = useState([]);
  const params = useParams();
 
  useEffect(() => {
    (async function getMovie() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${params.id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=videos`
      );
      setMovie(response.data);
    })();
  }, []);

  return (
    <div className="appcontainer">
      <div className="header">
        <Header />
      </div>
      <div className="moviedetail">
        <h1 className="movietitle">{movie.original_title}</h1>
        <p className="movieoverview">{movie.overview}</p>
        <div className="movieinfo">
          <p><strong>Release Date:</strong> {movie.release_date}</p>
          <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
          <p><strong>Origin Country:</strong> {movie.origin_country}</p>
          <p><strong>Budget:</strong> ${movie.budget} USD</p>
          <p><strong>Revenue:</strong> ${movie.revenue} USD</p>
          <p><strong>Rating:</strong> {movie.vote_average}/10</p>
          <p><strong>Status:</strong> {movie.status}</p>

        </div>
        {movie.poster_path && (
          <img
            className="movieposter"
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.original_title}
          />
        )}
        <div className="trailerssection">
          <h2>Trailers</h2>
          <div className="trailersgrid">
            {movie.videos && movie.videos.results.slice(0,5).map((trailer) => (
              <div key={trailer.id} className="trailertile">
                <a
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    className="trailerthumbnail"
                    src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                    alt={trailer.name}
                  />
                  <h3>{trailer.name}</h3>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  )
}

export default DetailMovieView;