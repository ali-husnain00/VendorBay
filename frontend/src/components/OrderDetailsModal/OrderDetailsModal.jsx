import React, { useContext, useState } from 'react';
import './OrderDetailsModal.css';
import { X } from 'lucide-react';
import { context } from '../Context/Context';
import { toast } from 'react-toastify';

const OrderDetailsModal = ({ order, onClose }) => {
  const { BASE_URL, getUserOrders } = useContext(context);
  const [loading, setLoading] = useState(false);

  if (!order) return null;

  const handleCancelOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/cancelOrder/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      if (res.ok) {
        toast.success('Order cancelled successfully!');
        getUserOrders();
        onClose();
      } else {
        toast.error('Could not cancel order.');
      }
    } catch (err) {
      toast.error('An error occurred while cancelling the order.');
    } finally {
      setLoading(false);
    }
  };

  const date = order.orderedAt || order.createdAt;
  const address = order.shippingAddress || {};
  const canCancel = order.orderStatus && order.orderStatus.toLowerCase() !== 'cancelled';

  return (
    <div className="order-details-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="order-details-title">
      <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="order-details-header">
          <h2 id="order-details-title">Order details</h2>
          <button type="button" className="order-details-close" onClick={onClose} aria-label="Close">
            <X size={22} />
          </button>
        </div>

        <div className="order-details-body">
          <div className="order-details-meta">
            <p><strong>Order ID</strong> {order._id}</p>
            <p><strong>Date</strong> {date ? new Date(date).toLocaleString() : '—'}</p>
            <span className={`order-details-status order-details-status-${(order.orderStatus || '').toLowerCase()}`}>
              {order.orderStatus || '—'}
            </span>
          </div>

          <section className="order-details-section">
            <h3>Items</h3>
            <ul className="order-details-products">
              {order.products?.map((item) => (
                <li key={item.product?._id || Math.random()} className="order-details-product">
                  <img
                    src={`${BASE_URL}/uploads/${item.product?.image}`}
                    alt={item.product?.title}
                    loading="lazy"
                    className="order-details-product-img"
                  />
                  <div className="order-details-product-info">
                    <strong>{item.product?.title}</strong>
                    <span>Qty: {item.quantity} × Rs {item.product?.price} = Rs {item.quantity * (item.product?.price || 0)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="order-details-section">
            <h3>Shipping address</h3>
            <p className="order-details-address">
              {address.addressLine && `${address.addressLine}, `}
              {address.city && `${address.city}, `}
              {address.postalCode && `${address.postalCode}, `}
              {address.country || '—'}
              {address.phone && ` · ${address.phone}`}
            </p>
          </section>

          <div className="order-details-summary">
            <p><strong>Payment</strong> {order.paymentMethod || '—'}</p>
            <p><strong>Total</strong> Rs {order.totalAmount ?? order.total ?? '—'}</p>
          </div>

          {canCancel && (
            <div className="order-details-actions">
              <button
                type="button"
                className="order-details-cancel-btn"
                onClick={handleCancelOrder}
                disabled={loading}
              >
                {loading ? 'Cancelling…' : 'Cancel order'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
