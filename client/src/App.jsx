import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Outlet } from "react-router-dom";
import Nav from "./ui/Nav";

export default function App() {
  const [cookies] = useCookies(["cart"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Ensure cookies.cart is a string before calling split
    if (cookies.cart && typeof cookies.cart === "string") {
      // Split the cart into items by comma, but ensure we don't count empty values.
      const items = cookies.cart.split(",").filter(Boolean); // Filter out empty strings
      // If no items, set cart count to 0; otherwise, count the items.
      const count = items.length > 0 ? items.length : 0;
      setCartCount(count);
    } else {
      setCartCount(0); // If no cart, set count to 0
    }
  }, [cookies.cart]);

  return (
    <>
      <h1 className="text-center">Pawsome Goods</h1>
      <div>
        {/* Pass isLoggedIn and cartCount as props */}
        <Nav isLoggedIn={isLoggedIn} cartCount={cartCount} />
      </div>
      <hr />
      <div>
        {/* Pass setIsLoggedIn through context for Login/Logout pages */}
        <Outlet context={setIsLoggedIn} />
      </div>
    </>
  );
}
