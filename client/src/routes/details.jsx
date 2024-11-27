import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

export default function Details() {
  const { id } = useParams();
  const [Product, setProduct] = useState(null);
  const [cookies, setCookie] = useCookies(['cart']); // Initialize cookies

  useEffect(() => {
      // fetch data from API
      async function fetchData() {
          const url = 'http://localhost:3000/api/products/' + id;
          const response = await fetch(url);
          if (response.ok) {
              const data = await response.json();
              if (!ignore) {
                setProduct(data);
              }
          } else {
            setProduct(null);
          }
          
      }

      let ignore = false;
      fetchData();
      return () => {
          ignore = true;
      }
  }, []);

  // Add a product to the cart cookie
  const addToCart = (productId) => {
    console.log(`Adding product ${productId} to the cart`);

    // Retrieve the current cart value or default to an empty string
    const currentCart = cookies.cart || '';
    
    // Create a new cart value by appending the new product ID
    const updatedCart = currentCart ? `${currentCart},${productId}` : productId;
    
    // Update the cookie with the new cart value
    setCookie('cart', updatedCart, { maxAge: 3600 }); // Cookie expires in 1 hour
    
    console.log('Updated cart cookie:', updatedCart);
  };

  return (
    <>
      <h1>Details Page for {Product ? Product.name : 'Unknown Product'}</h1>
      {Product ? (
        <div>
          <img
            src={`http://localhost:3000/images/${Product.image_filename}`}  
            alt={Product.name}
            className="product-image-large w-30"  
          />
          <h2>{Product.name}</h2>
          <p>Price: ${Product.cost}</p>
          <p>{Product.description}</p>
          <button  className = "btn btn-primary" onClick={() => addToCart(id)}>Add to cart</button>
          <Link to = "/Home">
            <button>Go back</button>
          </Link>
        </div>
      ) : (
        <div>Product not found.</div>
      )}
    </>
  );
}