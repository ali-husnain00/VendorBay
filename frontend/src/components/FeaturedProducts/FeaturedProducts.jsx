import React, { useState, useEffect, useContext } from 'react';
import "../LatestProducts/LatestProducts.css";
import { context } from '../Context/Context';
import { useNavigate } from 'react-router';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [sectionLoading, setSectionLoading] = useState(true);
  const { BASE_URL, handleAddToCart } = useContext(context);
  const navigate = useNavigate();

  const getFeaturedProducts = async () => {
    setSectionLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/featuredProducts`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const data = await res.json();
        setFeaturedProducts(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSectionLoading(false);
    }
  };

  useEffect(() => {
    getFeaturedProducts();
  }, []);

  if (sectionLoading) {
    return (
      <section className="latest-products">
        <h2>Featured Products</h2>
        <div className="section-loading" aria-label="Loading featured products">
          <div className="section-spinner" />
          <span>Loading…</span>
        </div>
      </section>
    );
  }

  return (
    <section className="latest-products">
      <h2>Featured Products</h2>
      <div className="products-container">
        {featuredProducts.map(product => (
          <div key={product._id} className="product-card" tabIndex={0} onClick={() => navigate(`/product/details/${product._id}`)}>
            <img src={`${BASE_URL}/uploads/${product.image}`} alt={product.title} className="product-image" loading="lazy" />
            <div className="product-info">
              <h3>{product.title.length > 30 ? product.title.slice(0, 30) + "..." : product.title}</h3>
              <p className="price">Rs {product.price}</p>
              <button type="button" className="add-to-cart-btn" onClick={(e) => { e.stopPropagation(); handleAddToCart(product._id); }}>Add to Cart</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
