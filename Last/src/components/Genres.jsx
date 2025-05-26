import './../components/Genres.css';
function GenreView({ genresList, onGenreClick }) {
  return (
    <div className="genretag">
      {genresList.map(([id, name]) => (
        <ul key={id}>
          <li onClick={() => onGenreClick(id)}>
            {name}
          </li>
        </ul>
      ))}
    </div>
  )
}

export default GenreView;