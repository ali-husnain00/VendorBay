import React, { useContext } from 'react';
import { context } from '../Context/Context';
import Loading from '../Loading/Loading';
import './SellerProducts.css';

const SellerProducts = () => {
  const { sellerProducts, loading, BASE_URL } = useContext(context);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="seller-products">
      <h2>My Products</h2>
      {sellerProducts && sellerProducts.length > 0 ? (
        <div className="product-list">
          {sellerProducts.map((prod) => (
            <div className="product-card" key={prod._id}>
              <div className="prod-head">
                <p className='category'>{prod.category}</p>
                <p className={`stock ${prod.stock > 0 ? "in-stock" : "out-of-stock"}`}>{prod.stock > 0 ? "In stock" : "Out of stock"}</p>
              </div>
                <img src={`${BASE_URL}/uploads/${prod.image}`} loading='lazy' />
              <h4>{prod.title.length > 50 ? prod.title.slice(0,50) + "..." : prod.title}</h4>
              <p className='prod-price'>Rs {prod.price}</p>
              <div className="action-btns">
                <button>Edit</button>
                <button>Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SellerProducts;
