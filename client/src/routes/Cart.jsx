import { useCookies } from 'react-cookie';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const [cookies] = useCookies(['cart']); // Read the 'cart' cookie
  const [cartItems, setCartItems] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  // Parse cart cookie and fetch product details
  useEffect(() => {
    async function fetchCartProducts() {
      if (!cookies.cart) return;

      const productCounts = {};
      const productIds = cookies.cart.split(',');

      // Count occurrences of each product ID
      productIds.forEach((id) => {
        productCounts[id] = (productCounts[id] || 0) + 1;
      });

      const uniqueIds = Object.keys(productCounts);

      // Fetch product details for each unique ID
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

      // Filter out any null (failed fetches) and update the state
      const validProducts = productDetails.filter((item) => item !== null);
      setCartItems(validProducts);

      // Calculate sub-total
      const total = validProducts.reduce((sum, item) => sum + item.total, 0);
      setSubTotal(total);

      // Calculate tax and grand total
      const calculatedTax = total * 0.15; // 15% tax
      setTax(calculatedTax);
      setGrandTotal(total + calculatedTax);
    }

    fetchCartProducts();
  }, [cookies.cart]);

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
                      style={{ width: '100px', height: 'auto' }}
                    />
                  </td>
                  <td>{item.name}</td>
                  <td>${item.cost.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${item.total.toFixed(2)}</td>
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
            <Link to="/Checkout" className="btn btn-primary" style={{ marginLeft: '1rem' }}>
              Complete Purchase
            </Link>
          </div>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
