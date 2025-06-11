import React, { useContext } from 'react';
import './Overview.css';
import { context } from '../Context/Context';
import Loading from '../Loading/Loading';

const Overview = () => {

  const { user, sellerStats, loading } = useContext(context)

  const stats = [
    { title: 'Total Products', value: sellerStats.totalProducts, icon: '📦' },
    { title: 'Products in Stock', value: sellerStats.productsInStock, icon: '📊' },
    { title: 'Total Sales', value: `Rs ${sellerStats.totalSale}`, icon: '💰' },
    { title: 'Pending Orders', value: sellerStats.pendOrders, icon: '📄' },
  ];

  if (loading || !sellerStats || !sellerStats.recentOrders) {
    return <Loading />
  }

  return (
    <div className="overview">
      <h2>Welcome back, {user.username}! 👋</h2>
      <p className="subheading">Here’s how your shop is doing today.</p>

      <div className="stats-cards">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <p className="stat-title">{stat.title}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-orders">
        <h3>Recent Orders</h3>
        {
          sellerStats.recentOrders.length > 0 ?
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {
                  sellerStats.recentOrders.map(order => (
                    order.prod.map((product, index) => (
                      <tr key={`${order.id}-${index}`}>
                        <td>{order.id}</td>
                        <td>{product.title.length > 20 ? product.title.slice(0, 20) + "..." : product.title}</td>
                        <td><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></td>
                        <td>{order.date}</td>
                      </tr>
                    ))
                  ))
                }
              </tbody>
            </table>
            :
            <p>No recent orders</p>
        }

      </div>
    </div>
  );
};

export default Overview;
