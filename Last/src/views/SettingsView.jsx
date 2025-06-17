import "./SettingsView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../context";
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from "../firebase";

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

function SettingsView() {
  const { genres, user, setGenres, setUser } = useStoreContext();

  // Initialize selectedGenres once from context genres
  const [selectedGenres, setSelectedGenres] = useState(() => {
    const initGenres = new Map();
    genres.forEach((value, key) => {
      initGenres.set(String(key), value);
    });
    return initGenres;
  });

  const [newFname, setNewFname] = useState(user.displayName?.split(' ')[0] || '');
  const [newLname, setNewLname] = useState(user.displayName?.split(' ')[1] || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [genreError, setGenreError] = useState('');
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const docRef = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();

            if (data.genres) {
              const userGenres = new Map(Object.entries(data.genres));
              setSelectedGenres(prev => {
                if (prev.size === 0) {
                  setGenres(userGenres);
                  return userGenres;
                }
                return prev;
              });
            }

            if (data.cart) {
              setCart(data.cart);
            }

            // Set first and last names if not already set locally
            if (data.firstName && !newFname) setNewFname(data.firstName);
            if (data.lastName && !newLname) setNewLname(data.lastName);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user, setGenres, newFname, newLname]);

  const handleGenreChange = (event) => {
    const genreId = event.target.value;
    const genreName = event.target.name;
    const updatedSelectedGenres = new Map(selectedGenres);

    if (event.target.checked) {
      updatedSelectedGenres.set(genreId, genreName);
    } else {
      updatedSelectedGenres.delete(genreId);
    }
    setSelectedGenres(updatedSelectedGenres);
  };


  const handleSaveChanges = async () => {
  setGenreError('');
  setPasswordError('');

  if (selectedGenres.size < 5) {
    setGenreError("You must select at least 5 genres.");
    return;
  }

  const auth = getAuth();
  const userCred = auth.currentUser;

  try {
    // Update genres, first and last name
    const userRef = doc(firestore, "users", user.uid);
    const updatedGenres = Object.fromEntries(selectedGenres);
    const updatePayload = {
      genres: updatedGenres,
      firstName: newFname,
      lastName: newLname,
    };
    await updateDoc(userRef, updatePayload);
    setGenres(selectedGenres);

    // Update display name if changed
    if (`${newFname} ${newLname}` !== user.displayName) {
      await updateProfile(userCred, { displayName: `${newFname} ${newLname}` });
      setUser({
        ...user,
        displayName: `${newFname} ${newLname}`,
        firstName: newFname,
        lastName: newLname,
      });
    }

    // Only attempt password update if newPassword is filled
    if (newPassword || confirmPassword || currentPassword) {
      if (!currentPassword) {
        setPasswordError('Please enter your current password.');
        return;
      }

      if (newPassword !== confirmPassword) {
        setPasswordError('Passwords do not match!');
        return;
      }

      if (!newPassword) {
        setPasswordError('Please enter a new password.');
        return;
      }

      const credential = EmailAuthProvider.credential(userCred.email, currentPassword);
      await reauthenticateWithCredential(userCred, credential);
      await updatePassword(userCred, newPassword);

      // Clear password fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }

    alert("Settings updated successfully!");
    navigate('/movies/genre');
    location.reload();
  } catch (error) {
    setPasswordError("Error updating settings:" + error.message);
  }
};


  function loadMovie(id) {
    navigate(`/movies/${id}`);
    location.reload();
  }

  return (
    <div className="setcontainer">
      <h1 className= "ti">Welcome {newFname} {newLname}, Email: {user.email}</h1>

      <div className="formContainer">
        {/* Allow all users to edit names */}
        <>
          <div className="formGroup">
            <label>Edit First Name:</label>
            <input
              type="text"
              value={newFname}
              onChange={(e) => setNewFname(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <label>Edit Last Name:</label>
            <input
              type="text"
              value={newLname}
              onChange={(e) => setNewLname(e.target.value)}
            />
          </div>
        </>

        {/* Password fields only for email/password users */}
        {user.providerData[0].providerId === "password" && (
          <>
            <div className="formGroup">
              <label>Current Password:</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label>New Password:</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="formGroup">
              <label>Confirm New Password:</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </>
        )}

        {passwordError && <div className="error">{passwordError}</div>}

        {/* Genres Selection */}
        <div className="genresContainer">
          <h3>Choose Your Genres</h3>
          <div className="checkboxContainer">
            {availableGenres.map((genre) => (
              <div key={genre.id}>
                <input
                  type="checkbox"
                  id={genre.name}
                  name={genre.name}
                  value={genre.id}
                  checked={selectedGenres.has(String(genre.id))}
                  onChange={handleGenreChange}
                />
                <label htmlFor={genre.name}>{genre.name}</label>
              </div>
            ))}
          </div>
          {genreError && <div className="error">{genreError}</div>}
        </div>

        <button className="saveButton" onClick={handleSaveChanges}>
          Save Changes
        </button>

        {/* Password update button only for email/password users */}
        
      </div>

      {/* Cart Display */}
      <div className="cartContainer">
        <h3>Previous Purchases:</h3>
        {cart.length > 0 ? (
          <div className="cartGrid">
            {cart.map((movie) => (
              <div key={movie.id} className="cartTile">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="cartImage"
                  onClick={() => loadMovie(movie.id)}
                />
                <h4 className="cartTitle">{movie.title}</h4>
              </div>
            ))}
          </div>
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}

export default SettingsView;
