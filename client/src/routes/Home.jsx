import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const apiHost = import.meta.env.VITE_API_HOST;
    const apiUrl = `${apiHost}/api/products/all`;
    const imagePath = `${apiHost}/images`;

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(apiUrl);
                if (response.ok) {
                    const data = await response.json();
                    setProducts(data);
                } else {
                    throw new Error("Failed to fetch products");
                }
            } catch (err) {
                setError(err.message);
            }
        }

        fetchProducts();
    }, [apiUrl]);

    return (
        <div className="home-page text-center py-5">
            <h1 className="display-4">Welcome to Pawsome Goods</h1>
            <p className="lead">Browse our wide selection of products</p>

            {error && <p className="error text-danger">{error}</p>}
            {!error && products.length === 0 && <p>Loading products...</p>}

            <div className="container">
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {products.map((product, index) => (
                        <div className="col" key={product.product_id}>
                            <div className="card shadow-sm h-100" style={{maxHeight: "650px"}}>
                                <Link to={`/details/${product.product_id}`} className="text-decoration-none">
                                    <img
                                        src={`${imagePath}/Pic${index + 1}.jpg`} // Dynamically set image name
                                        alt={product.name}
                                        className="card-img-top"
                                    />
                                    <div className="card-body d-flex flex-column text-primary-emphasis">
                                        <h5 className="card-title fs-5">{product.name}</h5>
                                        <p className="card-text fs-6 text-muted">${product.cost}</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}