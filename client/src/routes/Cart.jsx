import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Cart() {
  const [cookies, setCookie] = useCookies(["cart"]); // Read and update 'cart' cookie
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Parse cart cookie and fetch product details
  useEffect(() => {
    async function fetchCartProducts() {
      const cart = cookies.cart ? String(cookies.cart) : "";

      if (!cart) {
        setCartItems([]);  // Clear cartItems when the cart is empty
        return; // Exit early if the cart is empty
      }

      const productIds = cart.includes(",") ? cart.split(",") : [cart];

      const productCounts = {};

      productIds.forEach((id) => {
        productCounts[id] = (productCounts[id] || 0) + 1;
      });

      const uniqueIds = Object.keys(productCounts);

      const productDetails = await Promise.all(
        uniqueIds.map(async (id) => {
          const response = await fetch(`http://localhost:3000/api/products/${id}`);
          if (response.ok) {
            const product = await response.json();
            return {
              ...product,
              quantity: productCounts[id],
              total: product.cost * productCounts[id],
            };
          }
          return null;
        })
      );

      const validProducts = productDetails.filter((item) => item !== null);
      setCartItems(validProducts);

      const total = validProducts.reduce((sum, item) => sum + item.total, 0);
      setSubTotal(total);

      const calculatedTax = total * 0.15; // 15% tax
      setTax(calculatedTax);
      setGrandTotal(total + calculatedTax);
    }

    fetchCartProducts();
  }, [cookies.cart]); // Depend only on cookies.cart to trigger re-fetch when it changes

  const removeFromCart = (productId) => {
    const cartString = cookies.cart ? String(cookies.cart) : "";
    const currentCart = cartString.split(",");
    const productIdStr = String(productId);

    const index = currentCart.indexOf(productIdStr);
    if (index !== -1) {
      currentCart.splice(index, 1);
    }

    if (currentCart.length === 0) {
      setCookie("cart", "", { maxAge: 0 }); // Clear the cookie immediately
    } else {
      const updatedCart = currentCart.join(",");
      setCookie("cart", updatedCart, { maxAge: 3600 });
    }
  };

  return (
    <div className="cart-page">
      <h1 className="text-center">Your Cart</h1>
      {cartItems.length > 0 ? (
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.product_id}>
                  <td>
                    <img
                      src={`http://localhost:3000/images/${item.image_filename}`}
                      alt={item.name}
                      className="thumbnail"
                      style={{ width: "100px", height: "auto" }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>${item.cost.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${item.total.toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.product_id)} className="btn btn-danger">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>Subtotal: ${subTotal.toFixed(2)}</h3>
          <h3>Tax (15%): ${tax.toFixed(2)}</h3>
          <h3>Grand Total: ${grandTotal.toFixed(2)}</h3>

          <div className="actions">
            <Link to="/Home" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <Link to="/Checkout" className="btn btn-primary" style={{ marginLeft: "1rem" }}>
              Complete Purchase
            </Link>
          </div>
        </div>
      ) : (
        <p className="text-center">Your cart is empty.</p>
      )}
    </div>
  );
}
