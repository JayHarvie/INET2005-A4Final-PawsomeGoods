import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Outlet } from "react-router-dom";
import Nav from "./ui/Nav";

export default function App() {
  const [cookies] = useCookies(["cart"]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (cookies.cart && typeof cookies.cart === "string") {
      const items = cookies.cart.split(",").filter(Boolean);
      setCartCount(items.length > 0 ? items.length : 0);
    } else {
      setCartCount(0);
    }
  }, [cookies.cart]);

  return (
    <>
      <h1 className="text-center">Pawsome Goods</h1>
      <div>
        <Nav isLoggedIn={isLoggedIn} cartCount={cartCount} />
      </div>
      <hr />
      <div>
        {/* Pass both isLoggedIn and setIsLoggedIn */}
        <Outlet context={{ isLoggedIn, setIsLoggedIn }} />
      </div>
    </>
  );
}
