import React, { useContext } from 'react';
import './OrderCard.css';
import { context } from '../Context/Context';
import { toast } from 'react-toastify';
import Loading from '../Loading/Loading';

const OrderCard = ({ order }) => {
  const { BASE_URL, getUserOrders, loading, setLoading } = useContext(context);

  const handleCancelOrder = async (orderId) => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/cancelOrder/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.ok) {
        toast.success("Order cancelled successfully!")
        getUserOrders()
      }
    } catch (error) {
      toast.error("An error occured while cancelling the order.")
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }

  if(loading){
    return <Loading/>
  }

  return (
    <div className="order-card">
      <div className="order-header">
        <h4>Order ID: #{order._id}</h4>
        <p><strong>Ordered on:</strong> {new Date(order.orderedAt).toLocaleDateString()}</p>
        <span className={`order-status ${order.orderStatus}`}>{order.orderStatus}</span>
      </div>

      <div className="order-products">
        {order.products.map((prod) => (
          <div key={prod.product._id} className="order-product">
            <img src={`${BASE_URL}/uploads/${prod.product.image}`} alt={prod.product.title} loading='lazy' className='order-img' />
            <div className="product-info">
              <h5>{prod.product.title.length > 50 ? prod.product.title.slice(0, 50) + "..." : prod.product.title}</h5>
              <p><strong>Qty:</strong> {prod.quantity}</p>
              <p><strong>Price:</strong> Rs {prod.product.price * prod.quantity}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <p><strong>Shipping to:</strong> {order.shippingAddress.city}, {order.shippingAddress.country}</p>
        <p><strong>Payment:</strong> {order.paymentMethod}</p>
        <p><strong>Total:</strong> Rs {order.totalAmount}</p>
      </div>

      <div className="order-actions">
        <button className="cancel-btn" style={order.orderStatus === "cancelled" ? {display:"none"} : {display:"block"}} onClick={() => handleCancelOrder(order._id)}>Cancel</button>
      </div>
    </div>
  );
};

export default OrderCard;
