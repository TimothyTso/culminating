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
    const [newFname, setNewFname] = useState(user.displayName?.split(' ')[0] || '');
    const [newLname, setNewLname] = useState(user.displayName?.split(' ')[1] || '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedGenres, setSelectedGenres] = useState(new Map());
    const [passwordError, setPasswordError] = useState('');
    const [genreError, setGenreError] = useState('');
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize selectedGenres from context and Firestore user data
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
                            const userGenres = new Map(Object.entries(data.genres));
                            setSelectedGenres(userGenres);
                            setGenres(userGenres); // update context genres with fetched data
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
    }, [genres, user, setGenres]);

    const handleGenreChange = (event) => {
        const genreId = event.target.value; // string
        const genreName = event.target.name;
        const updatedSelectedGenres = new Map(selectedGenres);

        if (event.target.checked) {
            updatedSelectedGenres.set(genreId, genreName);
        } else {
            updatedSelectedGenres.delete(genreId);
        }
        setSelectedGenres(updatedSelectedGenres);
    };

    const handlePasswordChange = async () => {
        setPasswordError(''); // reset error
        const auth = getAuth();
        const userCred = auth.currentUser;

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

        try {
            const credential = EmailAuthProvider.credential(userCred.email, currentPassword);
            await reauthenticateWithCredential(userCred, credential);
            await updatePassword(userCred, newPassword);
            alert("Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error updating password:", error);
            setPasswordError("Error updating password. Please check your current password.");
        }
    };

    const handleSaveChanges = async () => {
        setGenreError('');
        setPasswordError('');

        // Validate genres selection
        if (selectedGenres.size < 5) {
            setGenreError("You must select at least 5 genres.");
            return;
        }

        const auth = getAuth();
        const userCred = auth.currentUser;

        // Only email/password users can update name
        if (user.providerData[0].providerId !== "password") {
            alert("Only email/password users can update their name.");
            // We can still allow genre update below, so don't return here
        }

        try {
            // Update Firestore genres and names (if allowed)
            const userRef = doc(firestore, "users", user.uid);
            const updatedGenres = Object.fromEntries(selectedGenres);

            // Prepare update payload
            const updatePayload = {
                genres: updatedGenres,
            };

            // Update names only if email/password user
            if (user.providerData[0].providerId === "password") {
                updatePayload.firstName = newFname;
                updatePayload.lastName = newLname;
            }

            await updateDoc(userRef, updatePayload, { merge: true });

            // Update React Context genres
            setGenres(selectedGenres);

            // Update Firebase Auth displayName for email/password users if changed
            if (
                user.providerData[0].providerId === "password" &&
                `${newFname} ${newLname}` !== user.displayName
            ) {
                await updateProfile(userCred, {
                    displayName: `${newFname} ${newLname}`
                });
                // Update context user as well
                setUser({
                    ...user,
                    displayName: `${newFname} ${newLname}`,
                    firstName: newFname,
                    lastName: newLname,
                });
            }

            alert("Settings updated successfully!");
            navigate('/movies/genre');
        } catch (error) {
            console.error("Error updating Firestore or profile:", error);
            setPasswordError("Error updating settings. Please try again.");
        }
    };

    function loadMovie(id) {
        navigate(`/movies/${id}`);
    }

    return (
        <div className="setcontainer">
            <h1>Welcome {newFname} {newLname}, Email: {user.email}</h1>

            <div className="formContainer">
                {/* Edit First Name and Last Name - only for email/password users */}
                {user.providerData[0].providerId === "password" && (
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

                {/* Edit Password Section - only for email/password users */}
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

                {/* Genre Selection - all users can update */}
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
                {user.providerData[0].providerId === "password" && (
                    <button className="saveButton" onClick={handlePasswordChange}>
                        Update Password
                    </button>
                )}
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
