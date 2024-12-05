import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();
  const setIsLoggedIn = useOutletContext(); // Access setIsLoggedIn
  const apiHost = import.meta.env.VITE_API_HOST;
  const apiUrl = `${apiHost}/api/users/logout`;

  useEffect(() => {
    async function logoutUser() {
      try {
        await fetch(apiUrl, { method: "POST", credentials: "include" });
        setIsLoggedIn(false); // Set login state to false
      } catch (error) {
        console.error("Error during logout:", error);
      }
    }

    logoutUser();
  }, [apiUrl, setIsLoggedIn]);

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
