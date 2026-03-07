import { useEffect, useState, useContext } from 'react';
import './OrdersList.css';
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';

const STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

const statusPillClass = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'delivered') return 'admin-pill admin-pill-delivered';
  if (s === 'shipped') return 'admin-pill admin-pill-shipped';
  if (s === 'cancelled') return 'admin-pill admin-pill-cancelled';
  return 'admin-pill admin-pill-processing';
};

const OrdersList = () => {
  const { BASE_URL } = useContext(context);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/orders`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = statusFilter
    ? orders.filter((o) => (o.orderStatus || '').toLowerCase() === statusFilter)
    : orders;

  if (loading) return <Loading />;

  return (
    <div className="admin-orders-container">
      <div className="admin-card admin-orders-card">
        <div className="admin-orders-header">
          <h3 className="admin-section-title">All Orders</h3>
          <select
            className="admin-orders-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {filteredOrders.length === 0 ? (
          <p className="admin-empty-state">No orders found.</p>
        ) : (
          <div className="admin-table-wrap">
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
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order.user?.email ?? '—'}</td>
                    <td>{order.seller?.email ?? 'N/A'}</td>
                    <td>
                      <div className="admin-orders-products">
                        {order.products?.map((p, i) => (
                          <div key={i} className="admin-order-product">
                            {p.product?.image && (
                              <img src={`${BASE_URL}/uploads/${p.product.image}`} alt="" loading="lazy" />
                            )}
                            <div>
                              <p>{p.product?.title?.length > 25 ? p.product.title.slice(0, 25) + '...' : p.product?.title ?? '—'}</p>
                              <small>Qty: {p.quantity}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>{order.paymentMethod ?? '—'}</td>
                    <td>
                      <span className={statusPillClass(order.orderStatus)}>{order.orderStatus || '—'}</span>
                    </td>
                    <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '—'}</td>
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

export default OrdersList;
