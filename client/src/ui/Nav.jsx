import { Link } from 'react-router-dom';

export default function Nav() {
    return (
        <nav style={{
            display: "flex",
            justifyContent: "center", 
            alignItems: "center",
            gap: "1rem", 
            padding: "1rem",
        }}>
            <Link to="/Home" className="text-primary-emphasis">Home</Link>
            <Link to="/Login" className="text-primary-emphasis">Login</Link>
            <Link to="/Cart" className="text-primary-emphasis">Cart</Link>
            <Link to="/Logout" className="text-primary-emphasis">Logout</Link>
        </nav>
    );
}