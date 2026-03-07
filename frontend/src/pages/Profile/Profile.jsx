import React, { useContext, useState, useEffect } from 'react';
import './Profile.css';
import { context } from '../../components/Context/Context';
import { Camera, Info } from 'lucide-react';
import OrderDetailsModal from '../../components/OrderDetailsModal/OrderDetailsModal';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, getLoggedInUser, BASE_URL, getUserOrders, userOrders } = useContext(context);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const handleProfileImageChange = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    setImage(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch(`${BASE_URL}/changeProfileImage`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      if (res.ok) {
        getLoggedInUser();
        toast.success('Profile picture updated!');
      }
    } catch (error) {
      toast.error('An error occurred while updating the image');
      console.log('An error occurred while updating the image: ' + error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/updateUser`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        getLoggedInUser();
        toast.success('Info updated successfully!');
      }
    } catch (error) {
      toast.error('An error occurred while updating the info');
      console.log('An error occurred while updating the user: ' + error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email);
    }
    getUserOrders();
  }, [user]);

  const shortId = (id) => (id ? String(id).slice(-8) : '—');
  const orderDate = (order) => {
    const d = order.orderedAt || order.createdAt;
    return d ? new Date(d).toLocaleDateString() : '—';
  };
  const orderTotal = (order) => order.totalAmount ?? order.total ?? '—';

  if (!user || loading) {
    return <Loading />;
  }

  return (
    <div className="profile">
      <div className="profile-card profile-user-card">
        <div className="profile-user-header">
          <label className="profile-pic-label" aria-label="Change profile photo">
            <img
              src={`${BASE_URL}/uploads/${user.profilePic}`}
              alt=""
              loading="lazy"
              className="profile-pic"
            />
            <span className="camera-icon">
              <Camera size={18} aria-hidden />
            </span>
            <input
              type="file"
              accept="image/*"
              className="profile-pic-input"
              onChange={(e) => handleProfileImageChange(e)}
            />
          </label>
          <div className="profile-user-meta">
            <h1 className="profile-name">{user?.username}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
        </div>

        <div className="profile-update-section">
          <h3>Update your info</h3>
          <form onSubmit={handleUpdateUser} className="profile-update-form">
            <div className="form-group">
              <label htmlFor="profile-username">Username</label>
              <input
                id="profile-username"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="profile-email">Email</label>
              <input
                id="profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <button type="submit" className="profile-update-btn">Update info</button>
          </form>
        </div>
      </div>

      <div className="profile-card profile-orders-card">
        <h2 className="profile-orders-title">My orders</h2>
        {userOrders.length > 0 ? (
          <ul className="profile-orders-list" role="list">
            {userOrders.map((order) => (
              <li key={order._id} className="profile-order-row">
                <span className="profile-order-id">#{shortId(order._id)}</span>
                <span className="profile-order-date">{orderDate(order)}</span>
                <span className={`profile-order-status profile-order-status-${(order.orderStatus || '').toLowerCase()}`}>
                  {order.orderStatus || '—'}
                </span>
                <span className="profile-order-total">Rs {orderTotal(order)}</span>
                <button
                  type="button"
                  className="profile-order-details-btn"
                  onClick={() => setOrderDetails(order)}
                  aria-label={`View details for order ${shortId(order._id)}`}
                  title="View details"
                >
                  <Info size={20} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="profile-orders-empty">No orders yet.</p>
        )}
      </div>

      {orderDetails && (
        <OrderDetailsModal order={orderDetails} onClose={() => setOrderDetails(null)} />
      )}
    </div>
  );
};

export default Profile;
