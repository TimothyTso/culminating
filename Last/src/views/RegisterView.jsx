import { useStoreContext } from '../context';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import "./RegisterView.css";

export default function RegisterView() {

  const navigate = useNavigate();
  const {setUser, setGenres } = useStoreContext();
  
  const [userF, setUserF] = useState("");
  const [userL, setUserL] = useState("");
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
  const registerByEmail = async (event) => {
    event.preventDefault();
    if (pass !== pass2) {
      alert("Passwords do not match!");
      return;
    }

    if (selectedGenres.size < 5) {
      alert("Please select at least 5 genres.");
      return;
    }

    try {
      // Create user with email and password
      const user = (await createUserWithEmailAndPassword(auth, mail, pass)).user;
      
      // Update user profile with first and last name
      await updateProfile(user, { displayName: `${userF} ${userL}` });
      
      setUser(user);  // Set the user in context
      

      // Store user genres and name in Firestore
      
      const selectgenrejs = Object.fromEntries(selectedGenres);
      
      const docRef = doc(firestore, "users", user.uid);
      
      await setDoc(docRef, {

        uid: user.uid,
        firstName: userF,
        lastName: userL,
        genres: selectgenrejs
      });
      console.log(user.uid);

      navigate('/movies/genre');  // Navigate to the next page
    } catch (error) {
      
      alert("Error creating user.");
      
    }
  };

  const registerByGoogle = async () => {
    if (selectedGenres.size < 5) {
      alert("Please select at least 5 genres.");
      return;
    }

    try {
      // Register user via Google Auth
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = userCredential.user;

      // Set the user in context
      setUser(user); 
      setGenres(selectedGenres);  // Set genres in context

      // Get first and last name from the user object or use empty strings if unavailable
      const firstName = userF || (user.displayName && user.displayName.split(" ")[0]) || '';
      const lastName = userL || (user.displayName && user.displayName.split(" ")[1]) || '';

      // Store genres and names in Firestore
      const selectgenrejs = Object.fromEntries(selectedGenres);
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, {
        uid: user.uid, 
        firstName: firstName, 
        lastName: lastName, 
        genres: selectgenrejs 
      });

      navigate('/movies/genre');  // Navigate to the next page
    } catch (error) {
      alert("Error creating user with Google!");
      console.log(error);
    }
  };
  

  return (
    
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-title">Register</h2>
        <form onSubmit={(e) => registerByEmail(e)} className="form">
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
              value={userF}
              required
              onChange = {(e) => setUserF(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="name2"
              className="form-input"
              value={userL}
              onChange = {(e) => setUserL(e.target.value)}
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
          <button onClick={registerByGoogle} className="g-submit-btn" type="button">
            Register by Google
          </button>
        </form>
      </div>
    </div>
  );
  }
