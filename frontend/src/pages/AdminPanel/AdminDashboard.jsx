import React, { useEffect, useState, useContext } from 'react';
import './AdminDashboard.css';
import { context } from '../../components/Context/Context';

const AdminDashboard = () => {
    const { BASE_URL } = useContext(context);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchStats = async () => {
        setLoading(true)
        try {
            const res = await fetch(`${BASE_URL}/admin/dashboard`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include'
            });
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard stats:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading || !stats) return <p>Loading...</p>;

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            <div className="stats-grid">
                <div className="stat-card primary">
                    <h3>👥 Users</h3>
                    <p>{stats.totalUsers}</p>
                </div>
                <div className="stat-card secondary">
                    <h3>🧑‍💼 Sellers</h3>
                    <p>{stats.totalSellers}</p>
                </div>
                <div className="stat-card accent">
                    <h3>📦 Products</h3>
                    <p>{stats.totalProducts}</p>
                </div>
                <div className="stat-card primary">
                    <h3>🛒 Orders</h3>
                    <p>{stats.totalOrders}</p>
                </div>
                <div className="stat-card secondary">
                    <h3>💰 Total Sales</h3>
                    <p>Rs {stats.totalSales}</p>
                </div>
            </div>

            <div className="recent-orders">
                <h3>🕒 Recent Orders</h3>
                {stats.recentOrders.length === 0 ? (
                    <p>No recent orders</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Product</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.productTitle.length > 25 ? order.productTitle.slice(0, 25) + '...' : order.productTitle}</td>
                                    <td>
                                        <span className={`status ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{order.date}</td>
                                    <td>Rs {order.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
