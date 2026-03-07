import React, { useEffect, useState, useContext } from 'react';
import './AdminDashboard.css';
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, Store, Package, ShoppingCart, IndianRupee } from 'lucide-react';

const chartData = (stats) => [
  { name: 'Users', value: stats?.totalUsers ?? 0 },
  { name: 'Sellers', value: stats?.totalSellers ?? 0 },
  { name: 'Products', value: stats?.totalProducts ?? 0 },
  { name: 'Orders', value: stats?.totalOrders ?? 0 },
];

const statusPillClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 'admin-pill admin-pill-delivered';
  if (s === 'shipped') return 'admin-pill admin-pill-shipped';
  if (s === 'cancelled') return 'admin-pill admin-pill-cancelled';
  return 'admin-pill admin-pill-processing';
};

const AdminDashboard = () => {
  const { BASE_URL } = useContext(context);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/dashboard`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

  if (loading || !stats) return <Loading />;

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-users">
            <Users size={22} />
          </div>
          <div className="admin-stat-content">
            <span className="admin-stat-label">Users</span>
            <span className="admin-stat-value">{stats.totalUsers}</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-sellers">
            <Store size={22} />
          </div>
          <div className="admin-stat-content">
            <span className="admin-stat-label">Sellers</span>
            <span className="admin-stat-value">{stats.totalSellers}</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-products">
            <Package size={22} />
          </div>
          <div className="admin-stat-content">
            <span className="admin-stat-label">Products</span>
            <span className="admin-stat-value">{stats.totalProducts}</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-orders">
            <ShoppingCart size={22} />
          </div>
          <div className="admin-stat-content">
            <span className="admin-stat-label">Orders</span>
            <span className="admin-stat-value">{stats.totalOrders}</span>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-sales">
            <IndianRupee size={22} />
          </div>
          <div className="admin-stat-content">
            <span className="admin-stat-label">Total Sales</span>
            <span className="admin-stat-value">Rs {stats.totalSales}</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-chart admin-card">
        <h3 className="admin-dashboard-section-title">Overview</h3>
        <div className="admin-dashboard-chart-inner">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData(stats)} margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" fill="#1E90FF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="admin-dashboard-recent admin-card">
        <h3 className="admin-dashboard-section-title">Recent Orders</h3>
        {stats.recentOrders.length === 0 ? (
          <p className="admin-dashboard-empty">No recent orders</p>
        ) : (
          <div className="admin-table-wrap">
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
                    <td className="admin-table-id">{String(order._id).slice(-8)}</td>
                    <td>{order.productTitle?.length > 25 ? order.productTitle.slice(0, 25) + '...' : order.productTitle}</td>
                    <td>
                      <span className={statusPillClass(order.status)}>{order.status}</span>
                    </td>
                    <td>{order.date}</td>
                    <td>Rs {order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
