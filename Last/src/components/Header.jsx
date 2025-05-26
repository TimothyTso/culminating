import { useNavigate } from "react-router-dom"
import "./../components/Header.css"
function Header() {
    const navigate = useNavigate();

    return (
      <div>
        <div className="menu">
        </div>
        <h1 className="title">Poorflix</h1>
        <div className="buttons">
        <button className="login" onClick={() => navigate('/login')}>Login</button>
        <button className="register" onClick={() => navigate('/register')}>Register</button>
        </div>
      </div>
    )
  }
  
  export default Header;