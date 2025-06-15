import { useContext, useState } from 'react';
import './AdminPanel.css';
import { IoChevronBack } from "react-icons/io5";
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import AdminDashboard from './AdminDashboard';
import UsersList from './UsersList';
import SellersList from './SellersList';
import ProductsList from './ProductsList';
import OrdersList from './OrdersList';
import { useNavigate } from 'react-router';

const AdminPanel = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { user, BASE_URL, loading } = useContext(context);
  const navigate = useNavigate()

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <UsersList />;
      case 'sellers':
        return <SellersList />;
      case 'products':
        return <ProductsList />;
      case 'orders':
        return <OrdersList/>;
      default:
        return null;
    }
  };

  if (loading || !user) return <Loading />;

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="back-to-home-btn" onClick={() =>navigate("/")}>
          <IoChevronBack size={20} fontWeight={1000}/>
          Back to home
        </div>
        <div className="admin-info">
          <img src={`${BASE_URL}/uploads/${user.profilePic}`} alt="Admin Avatar" loading="lazy" />
          <h3>{user.username}</h3>
        </div>
        <nav className="nav-menu">
          <button onClick={() => setActiveView('dashboard')} className={`nav-link ${activeView === 'dashboard' ? 'act' : ''}`}>📊 Dashboard</button>
          <button onClick={() => setActiveView('users')} className={`nav-link ${activeView === 'users' ? 'act' : ''}`}>👥 Manage Users</button>
          <button onClick={() => setActiveView('sellers')} className={`nav-link ${activeView === 'sellers' ? 'act' : ''}`}>🧑‍💼 Manage Sellers</button>
          <button onClick={() => setActiveView('products')} className={`nav-link ${activeView === 'products' ? 'act' : ''}`}>🛍️ Manage Products</button>
          <button onClick={() => setActiveView("orders")} className={`nav-link ${activeView === 'orders' ? 'act' : ''}`}>⚙️ Manage Orders</button>
        </nav>
      </aside>

      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
};

export default AdminPanel;
