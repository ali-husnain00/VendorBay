import React from 'react';
import './LatestProducts.css';
import { useState } from 'react';
import { useContext } from 'react';
import { context } from '../Context/Context';
import { useEffect } from 'react';
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router';

const LatestProducts = () => {

  const [latestProducts, setLatestProducts] = useState([]);
  const { BASE_URL, loading, setLoading } = useContext(context)
  const navigate = useNavigate()

  const getLatestProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/latestProducts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      if (res.ok) {
        const data = await res.json();
        setLatestProducts(data)
      }
    } catch (error) {
      console.log(error)
    }
    finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLatestProducts()
  }, [])

  if (loading) {
    return <Loading />
  }

  return (
    <section className="latest-products">
      <h2>Latest Products</h2>
        <div className="products-container">
        {latestProducts.map(product => (
          <div key={product._id} className="product-card" tabIndex={0} onClick={() => navigate(`/product/details/${product._id}`)}>
            <img src={`${BASE_URL}/uploads/${product.image}`} className="product-image" loading='lazy' />
            <div className="product-info">
              <h3>{product.title.length > 30 ? product.title.slice(0,30) + "..." : product.title}</h3>
              <p className="price">Rs {product.price}</p>
              <button className="add-to-cart-btn">Add to Cart</button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default LatestProducts;
