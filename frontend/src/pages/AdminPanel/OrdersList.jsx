import { useEffect, useState, useContext } from 'react';
import './OrdersList.css';
import { context } from '../../components/Context/Context';

const OrdersList = () => {
    const { BASE_URL } = useContext(context);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/admin/orders`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="admin-orders">
            <h2>📦 All Orders</h2>
            {orders.length === 0 ? (
                <p>No orders found.</p>
            ) : (
                <div className="orders-table">
                    <table>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Seller</th>
                                <th>Products</th>
                                <th>Payment</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order._id}>
                                    <td>{order.user?.email}</td>
                                    <td>{order.seller?.email || 'N/A'}</td>
                                    <td>
                                        {order.products.map((p, i) => (
                                            <div key={i} className="order-product">
                                                <img src={`${BASE_URL}/uploads/${p.product.image}`} alt={p.product.title} />
                                                <div>
                                                    <p>{p.product.title.length > 25 ? p.product.title.slice(0,25) + "...": p.product.title}</p>
                                                    <small>Qty: {p.quantity}</small>
                                                </div>
                                            </div>
                                        ))}
                                    </td>
                                    <td>{order.paymentMethod}</td>
                                    <td>{order.orderStatus}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default OrdersList;
