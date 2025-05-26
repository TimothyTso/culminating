import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useStoreContext } from '../context';
import "./RegisterView.css";

export default function RegisterView() {

  const navigate = useNavigate();
  const { setEmail: setContextEmail, setFirst, setLast, setPassword: setContextPassword, setGenres } = useStoreContext();
  console.log({ setFirst, setLast, setContextEmail, setContextPassword, setGenres });
  const [user, setUser] = useState("");
  const [user2, setUser2] = useState("");
  const [mail, setMail] = useState("");
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [selectedGenres, setSelectedGenres] = useState(new Map());
  
  const availableGenres = [
    { name: "Action", id: 28 },
    { name: "War", id: 10752 },
    { name: "Animation", id: 16 },
    { name: "Thriller", id: 53 },
    { name: "Horror", id: 27 },
    { name: "History", id: 36 },
    { name: "Family", id: 10751 },
    { name: "Music", id: 10402 },
    { name: "Science Fiction", id: 878 },
    { name: "Comedy", id: 35 },
    { name: "Western", id: 37 },
  ];
  const handleGenreChange = (event) => {
    const genreId = parseInt(event.target.value);
    const genreName = event.target.dataset.name;

    setSelectedGenres(prevSelectedGenres => {
      const newGenres = new Map(prevSelectedGenres); 
      if (newGenres.has(genreId)) {
        newGenres.delete(genreId); 
      } else {
        newGenres.set(genreId, genreName); 
      }
      return newGenres;
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
  

   if (pass != pass2){
    alert("passwords do not match");
  }else if (selectedGenres.size<5){
    alert("select atleast 5 genres");
  }else{
    navigate('/movies/genre');
    setFirst(user);
    setLast(user2);
    setContextEmail(mail); 
    setContextPassword(pass);
    setGenres(selectedGenres);  
  }
}
  

  return (
    
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-title">Register</h2>
        <form onSubmit={handleSubmit} className="form">
          <h2>Select Your Preferred Genres</h2>
<div className="genre-columns">
  <div className="genre-column">
    {availableGenres.slice(0, Math.ceil(availableGenres.length / 2)).map((genre) => (
      <div key={genre.id}>
        <input
          type="checkbox"
          id={genre.id}
          value={genre.id}
          data-name={genre.name}
          checked={selectedGenres.has(genre.id)}
          onChange={handleGenreChange}
        />
        <label className="label">{genre.name}</label><br />
      </div>
    ))}
  </div>
  <div className="genre-column">
    {availableGenres.slice(Math.ceil(availableGenres.length / 2)).map((genre) => (
      <div key={genre.id}>
        <input
          type="checkbox"
          id={genre.id}
          value={genre.id}
          data-name={genre.name}
          checked={selectedGenres.has(genre.id)}
          onChange={handleGenreChange}
        />
        <label className="label">{genre.name}</label><br />
      </div>
    ))}
  </div>
</div>

  
          <div className="form-group">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="name1"
              className="form-input"
              value={user}
              required
              onChange = {(e) => setUser(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="name2"
              className="form-input"
              value={user2}
              onChange = {(e) => setUser2(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={mail}
              onChange = {(e) => setMail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password1"
              className="form-input"
              value={pass}
              onChange = {(e) => setPass(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Re-Enter Password</label>
            <input
              type="password"
              name="password2"
              className="form-input"
              value={pass2}
              onChange = {(e) => setPass2(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
  }
