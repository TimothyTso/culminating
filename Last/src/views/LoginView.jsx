import { useNavigate } from "react-router-dom";
import { useState, useRef} from 'react'; 
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import "./LoginView.css";

export default function LoginView() {
  const email = useRef('');
  const [upassword, setUPassword] = useState('');
  const navigate = useNavigate();
 

  async function loginByEmail(event) {
    event.preventDefault();

    try {
      const user = (await signInWithEmailAndPassword(auth, email.current.value, upassword)).user;
      navigate('/movies/genre');
      location.reload();
      
    } catch (error) {
      alert(`Error signing in: ${error.message}`);
    }
  }
  async function loginByGoogle() {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      navigate('/movies/genre');
      location.reload();
      
    } catch (error) {
      alert(`Error signing in: ${error.message}`);
      
    }
  }
  return (
    <div className="register-container">
      <div className="register-form">
        <h2 className="register-title">Login</h2>
        <form onSubmit={(event) => { loginByEmail(event) }} className="form">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              ref={email}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={upassword}
              onChange={(event) => setUPassword(event.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="submit-btn">
            Login
          </button>
          <button onClick={() => loginByGoogle()} className="g-submit-btn" type="button">
            Login with Google
          </button>
        </form>
      </div>
    </div>
  );
}
