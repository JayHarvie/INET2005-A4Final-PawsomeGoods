import { useNavigate } from "react-router-dom";

export default function Confirmation() {
  const navigate = useNavigate();

  // Function to handle navigation to the Home page
  const handleContinueShopping = () => {
    navigate("/Home"); // Redirect to the Home page
  };

  return (
    <div className="text-center">
      <h1>Purchase Complete</h1>
      <p>Your order has been successfully placed. Thank you for shopping with us!</p>
      <button className="btn btn-primary" onClick={handleContinueShopping}>
        Continue Shopping
      </button>
    </div>
  );
}
