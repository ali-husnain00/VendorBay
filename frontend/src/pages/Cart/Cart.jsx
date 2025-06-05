import React, { useContext, useEffect, useState } from 'react';
import { context } from '../../components/Context/Context';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router';
import Loading from '../../components/Loading/Loading';
import './Cart.css';

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [total, setTotal] = useState(0);
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

  const handleRemoveProduct = async (id) =>{
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/product/removefromcart/${id}`,{
        method:"DELETE",
        headers:{
          "Content-Type":"application/json"
        },
        credentials:"include"
      })
      if(res.ok){
        toast.success("Product removed from cart successfull!")
        getCartProducts();
      }
      else{
        toast.error("An error occured while removing product");
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  const handleClearCart = async () =>{
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/clearCart`,{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        credentials:"include"
      })
      if(res.ok){
        toast.success("Cart cleared successfully!")
        getCartProducts()
      }
      else{
        toast.error("An error occured while clearing the cart")
      }
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  useEffect(() => {
    getCartProducts();
  }, [user]);

  useEffect(() => {
   const totalPrice = cartProducts.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setTotal(totalPrice);
  }, [cartProducts]);

  const handleCheckout = () => {
    toast.success("Proceeding to checkout...");
    navigate("/checkout"); 
  };

  if (loading || !user) return <Loading />;

  return (
    <div className="cart">
      <h2 className="cart-heading">Your Cart 🛒</h2>

      {cartProducts.length > 0 ? (
        <div className="cart-main">
          <div className="cart-items">
            {cartProducts.map((item) => (
              <div key={item?.product?._id} className="cart-item">
                <div className="remove-icon" title='Remove from cart' onClick={() =>handleRemoveProduct(item?.product?._id)}>x</div>
                <img
                  src={`${BASE_URL}/uploads/${item?.product?.image}`}
                  className="cart-image" loading='lazy'
                />
                <div className="cart-details">
                  <h3>{item.product.title.length > 50 ? item.product.title.slice(0,50) + "..." : item.product.title}</h3>
                  <p className="price">Rs {item.product.price}</p>
                  <p className="category">Category: {item.product.category}</p>
                  <div className="quant-control">
                    <span>Quantity:{item.quantity} </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Order Summary</h3>
            <p>Subtotal: Rs {total}</p>
            <p>Shipping: Rs 100</p>
            <hr />
            <h4>Total: Rs {total + 100}</h4>
            <div className="cart-action-btns">
              <button className="checkout-btn" onClick={handleCheckout}>
              Checkout 🔒
            </button>
            <button onClick={handleClearCart} className="clear-cart-btn">Clear Cart 🗑️</button>
            </div>
          </div>
        </div>
      ) : (
        <p className="empty-cart-msg">Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
