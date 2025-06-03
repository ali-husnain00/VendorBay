import React, { useContext, useEffect, useState } from 'react';
import { context } from '../../components/Context/Context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Loading from '../../components/Loading/Loading';
import './Cart.css';

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const navigate = useNavigate();
  const { BASE_URL, loading, setLoading, user } = useContext(context);

  const getCartProducts = async () => {
    if (!user) {
      toast.warning('Please login to see your cart!');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/getCartProducts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setCartProducts(data);
      } else {
        toast.error('Failed to fetch cart products.');
      }
    } catch (error) {
      console.error('Error fetching cart products:', error);
      toast.error('An error occurred while fetching cart products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCartProducts();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="cart">
      <h2>Your Cart 🛒</h2>
      {cartProducts.length > 0 ? (
        <div className="cart-list">
          {cartProducts.map((item) => (
            <div key={item.product._id} className="cart-item">
              <img
                src={`${BASE_URL}/uploads/${item.product.image}`}
                alt={item.product.title}
                className="cart-image"
              />
              <div className="cart-details">
                <h3>{item.product.title}</h3>
                <p>Price: Rs {item.product.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
