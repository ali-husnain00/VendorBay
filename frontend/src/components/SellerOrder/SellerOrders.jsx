import React, { useEffect, useState, useContext } from 'react';
import './SellerOrders.css';
import Loading from '../Loading/Loading';
import { context } from '../Context/Context';
import { toast } from 'react-toastify';

const SellerOrders = () => {
    const [orders, setOrders] = useState([]);
    const { BASE_URL } = useContext(context);
    const [loading, setLoading] = useState(false)
    const [prodToUpdate, setProdToUpdate] = useState("")


    const fetchOrders = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/getSellerOrders`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data);
                }
            } catch (err) {
                console.error("Error fetching seller orders:", err);
            } finally {
                setLoading(false);
            }
        };


        const handleStatusChange = async (orderId, newStatus) => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/updateOrderStatus/${orderId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                toast.success("Order status updated successfully!")
                fetchOrders()
            }
        } catch (err) {
            console.error("Failed to update status", err);
        }
        finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);


    if (loading) return <Loading />;

    return (
        <div className="seller-orders-container">
            <h2>Your Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                orders.map((order) => {
                    const orderTotal = order.products.reduce((acc, item) => {
                        return acc + (item.product.price * item.quantity);
                    }, 0);

                    return (
                        <div className="seller-order-card" key={order._id}>
                            <div className="seller-order-header">
                                <span><strong>Order ID:</strong> {order._id}</span>
                                <span><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</span>
                                <div className="shipping-info">
                                    <div className='ship-add'>
                                        <span><strong>Shipping Address:</strong> {`${order.shippingAddress.addressLine}, ${order.shippingAddress.city}, ${order.shippingAddress.country}`}</span>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                            className={`status-dropdown ${order.orderStatus}`}
                                        >
                                            <option value="processing">Processing</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </div>
                                   <span><strong>Contact No:</strong> {order.shippingAddress.phone}</span>
                                </div>
                            </div>

                            <div className="seller-order-products">
                                {order.products.map((item) => (
                                    <div className="product-item" key={item.product._id}>
                                        <img
                                            src={`${BASE_URL}/uploads/${item.product.image}`}
                                            alt={item.product.title}
                                            loading="lazy"
                                        />
                                        <div className='order-info'>
                                            <h4>{item.product.title}</h4>
                                            <p><strong>Qty:</strong> {item.quantity}</p>
                                            <p><strong>Price:</strong> Rs {item.product.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="seller-order-footer">
                                <strong>Payment: <span > {order.paymentMethod}</span></strong>
                                <strong className='total'>Total: Rs {orderTotal}</strong>
                            </div>
                        </div>
                    );
                })

            )}
        </div>
    );
};

export default SellerOrders;
