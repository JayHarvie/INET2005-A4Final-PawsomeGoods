import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useOutletContext(); // Destructure from the context object
  const apiHost = import.meta.env.VITE_API_HOST;
  const apiUrl = `${apiHost}/api/users/logout`;

  useEffect(() => {
    async function logoutUser() {
      try {
        const response = await fetch(apiUrl, { 
          method: "POST", 
          credentials: "include" 
        });

        if (!response.ok) {
          throw new Error(`Logout failed: ${response.statusText}`);
        }

        setIsLoggedIn(false); // Update login state
        console.log("User successfully logged out.");
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    logoutUser();
  }, [apiUrl, isLoggedIn, setIsLoggedIn]);

  return (
    <div className="d-flex flex-column align-items-center vh-100">
      <h1 className="mb-4">You have been logged out successfully</h1>
      <div>
        <button className="btn btn-primary me-2" onClick={() => navigate("/login")}>
          Login
        </button>
        <button className="btn btn-outline-dark" onClick={() => navigate("/Home")}>
          Home
        </button>
      </div>
    </div>
  );
}
