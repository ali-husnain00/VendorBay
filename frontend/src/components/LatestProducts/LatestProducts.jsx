import React, { useState, useEffect, useContext } from 'react';
import './LatestProducts.css';
import { context } from '../Context/Context';
import { useNavigate } from 'react-router';

const LatestProducts = () => {
  const [latestProducts, setLatestProducts] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);
  const { BASE_URL, handleAddToCart } = useContext(context);
  const navigate = useNavigate();

  const handleAddToCartClick = (e, productId) => {
    e.stopPropagation();
    handleAddToCart(productId);
  };

  const getLatestProducts = async () => {
    setSectionLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/latestProducts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setLatestProducts(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSectionLoading(false);
    }
  };

  useEffect(() => {
    getLatestProducts();
  }, []);

  if (sectionLoading) {
    return (
      <section className="latest-products">
        <h2>Latest Products</h2>
        <div className="section-loading" aria-label="Loading latest products">
          <div className="section-spinner" />
          <span>Loading…</span>
        </div>
      </section>
    );
  }

  return (
    <section className="latest-products">
      <h2>Latest Products</h2>
      <div className="products-container">
        {latestProducts.map(product => (
          <div key={product._id} className="product-card" tabIndex={0} onClick={() => navigate(`/product/details/${product._id}`)} role="button" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/product/details/${product._id}`); } }}>
            <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.title} className="product-image" loading="lazy" />
            <div className="product-info">
              <h3>{product.title.length > 30 ? product.title.slice(0, 30) + "..." : product.title}</h3>
              <p className="price">Rs {product.price}</p>
              <button type="button" className="add-to-cart-btn" onClick={(e) => handleAddToCartClick(e, product._id)}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
