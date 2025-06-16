import "./SettingsView.css";
import { useState, useEffect } from "react";
import { useStoreContext } from "../context";
import { useNavigate } from 'react-router-dom';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
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
    const {  genres, user, setGenres } = useStoreContext();
    const [newFname, setNewFname] = useState(user.displayName.split(' ')[0] || '');
    const [newLname, setNewLname] = useState(user.displayName.split(' ')[1] || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedGenres, setSelectedGenres] = useState(new Map());
    const [passwordError, setPasswordError] = useState('');
    const [genreError, setGenreError] = useState('');
    const [cart, setCart] = useState([]); 
    const navigate = useNavigate();

    useEffect(() => {
        const initGenres = new Map();
        genres.forEach((value, key) => {
    initGenres.set(String(key), value);
        });
        setSelectedGenres(initGenres);
        const fetchUserData = async () => {
            if (user) {
                try {
                    const docRef = doc(firestore, "users", user.uid);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        if (data.genres) {
                            const userGenres = new Map(Object.entries(data.genres)); // keys are strings here
                            setSelectedGenres(userGenres); 
                        }
                        if (data.cart) {
                            setCart(data.cart);
                        } 
                        if (data.firstName) setNewFname(data.firstName);
                        if (data.lastName) setNewLname(data.lastName);
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            }
        };
        fetchUserData();
    }, [genres, user]);
    
    const handleGenreChange = async (event) => {
            const genreId = event.target.value; // string
            const genreName = event.target.name;
            const updatedSelectedGenres = new Map(selectedGenres);

            if (event.target.checked) {
                updatedSelectedGenres.set(genreId, genreName); 
                } else {
                updatedSelectedGenres.delete(genreId); 
                }
            setSelectedGenres(updatedSelectedGenres);
            }
    
        
    
        const handleSaveChanges = async () => {
            const auth = getAuth();
            const userCred = auth.currentUser;
    
            if (newPassword !== confirmPassword) {
                setPasswordError('Passwords do not match!');
                return;
            }
    
            if (!currentPassword) {
                setPasswordError('Please enter your current password.');
                return;
            }
    
            const credential = EmailAuthProvider.credential(userCred.email, currentPassword); // Use current password for re-authentication
    
            // Check if at least 5 genres are selected
            if (selectedGenres.size < 5) {
                setGenreError("You must select at least 5 genres.");
                return;
            } else {
                setGenreError(""); // Clear error if condition is met
            }
    
            const updatedGenres = Object.fromEntries(selectedGenres);
            if (user.providerData[0].providerId === "google.com") {
                setNewFname(user.displayName.split(' ')[0] || ''); 
                setNewLname(user.displayName.split(' ')[1] || ''); 
            } else {
                setNewFname(newFname);
                setNewLname(newLname);
            }
    
            try {
                const userRef = doc(firestore, "users", user.uid);
                await reauthenticateWithCredential(userCred, credential);
                await updatePassword(userCred, newPassword);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                await updateDoc(userRef, {
                    genres: updatedGenres, // Save selected genres to Firestore
                    firstName: newFname,
                    lastName: newLname,
                }, { merge: true });
                alert("Settings updated successfully!");
                navigate('/movies/genre');
            } catch (error) {
                console.error("Error updating Firestore:" + error.message);
                setPasswordError("Error updating password. Please check your current password.");
            }
        };

    function loadMovie(id) {
    navigate(`/movies/${id}`);
    }

    return (
        <div className="setcontainer">
            <h1>Welcome {newFname} {newLname}, Email: {user.email}</h1>

            <div className="formContainer">
                {/* Conditionally Render First Name and Last Name Fields */}
                {user.providerData[0].providerId !== "google.com" && (
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
                )}
                
                {/* Edit Password Section - Only for email users */}
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

                {/* Display password errors */}
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
                                    checked={selectedGenres.has(String(genre.id))}  // Pre-select if the genre is in selectedGenres
                                    onChange={handleGenreChange} // Update on change (select or deselect)
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
                                    onClick={() => {
                                    loadMovie(movie.id);
                                    }}
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
