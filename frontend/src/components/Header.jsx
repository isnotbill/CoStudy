import { NavLink } from "react-router-dom";
import "../css/Header.css"

const Header = () => {
    return (
        <header className="no-select">
            <h1 className="title">costudy</h1>
            <div className="pages">
                <NavLink to="/" className="nav-link">Home</NavLink>
                <NavLink to="/about" className="nav-link">About Us</NavLink>
                <NavLink to="/registration">
                    <button>Login</button>
                </NavLink>

            </div>

        </header>
    );
};

export default Header;
