import { useState, useEffect } from "react";
import { useStoreContext } from "../context";
import "./SettingsView.css";
import { useNavigate } from 'react-router-dom';

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
    const { email, fname, lname, genres, setFirst, setLast, setGenres } = useStoreContext();
    const [newFname, setNewFname] = useState(fname);
    const [newLname, setNewLname] = useState(lname);
    const [selectedGenres, setSelectedGenres] = useState(new Map());
    const navigate = useNavigate();

    useEffect(() => {
        const initGenres = new Map();
        genres.forEach((value, key) => {
            initGenres.set(key, value);
        });
        setSelectedGenres(initGenres);
    }, [genres]);

    const handleGenreChange = (event) => {
        const genreId = parseInt(event.target.value);
        const genreName = event.target.name;

        const updatedSelectedGenres = new Map(selectedGenres);

        if (event.target.checked) {
            updatedSelectedGenres.set(genreId, genreName);
        } else {
            updatedSelectedGenres.delete(genreId);
        }

        setSelectedGenres(updatedSelectedGenres);
    };

    const handleSaveChanges = () => {
        setFirst(newFname);
        setLast(newLname);
        setGenres(selectedGenres);
        alert("Settings updated successfully!");
        navigate('/movies/genre');
    };

    return (
        <div className="setcontainer">
            

            <div className="formContainer">
                <h1 className= "set">Welcome {fname} {lname}, Email: {email}</h1>
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
                                    checked={selectedGenres.has(genre.id)}
                                    onChange={handleGenreChange}
                                />
                                <label htmlFor={genre.name}>{genre.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                className="saveButton" 
                onClick={handleSaveChanges}>
                    Save Changes
                </button>
            </div>
        </div>
    );
}

export default SettingsView;
