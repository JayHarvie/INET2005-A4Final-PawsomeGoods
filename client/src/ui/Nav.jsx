import { Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa"; // For shopping cart icon

export default function Nav({ isLoggedIn, cartCount }) {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        padding: "1rem",
      }}
    >
      <Link to="/Home" className="text-primary-emphasis">Home</Link>
      {isLoggedIn ? (
        <Link to="/Logout" className="text-primary-emphasis">Logout</Link>
      ) : (
        <Link to="/Login" className="text-primary-emphasis">Login</Link>
      )}
      <Link to="/Cart" className="text-primary-emphasis">
        <FaShoppingCart />
        {cartCount >= 0 && (  // Ensure the cartCount is at least 0
          <span
            className="badge bg-primary"
            style={{
              marginLeft: "0.5rem",
              borderRadius: "50%",
              padding: "0.3rem 0.6rem",
              fontSize: "0.8rem",
            }}
          >
            {cartCount}
          </span>
        )}
      </Link>
    </nav>
  );
}
