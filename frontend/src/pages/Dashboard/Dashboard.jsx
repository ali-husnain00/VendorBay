import { useContext, useState } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router';
import AddProducts from '../../components/AddProducts/AddProducts';
import SellerProducts from '../../components/SellerProducts/SellerProducts';
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import Overview from '../../components/Overview/Overview';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const navigate = useNavigate()
  const {seller, BASE_URL, loading} = useContext(context)

  const renderView = () => {
    switch (activeView) {
      case 'overview':
        return <Overview/>
      case 'add-product':
        return <AddProducts/>
      case 'my-products':
        return <SellerProducts/>
      case 'orders':
        return <div className="view">All orders placed on your products.</div>;
      case 'notifications':
        return <div className="view">You have 2 new notifications 📬</div>;
      case 'profile':
        return <div className="view">Update your seller profile.</div>;
      default:
        return null;
    }
  };

  if(loading || !seller){
    return <Loading/>
  }

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="seller-info">
          <img src={`${BASE_URL}/uploads/${seller.storeBanner}` } loading = "lazy" />
          <h3>{seller.storeName}</h3>
        </div>
        <nav className="nav-menu">
          <button onClick={() => setActiveView('overview')} className={`nav-link ${activeView === 'overview' ? 'act' : ''}`}>🏠 Overview</button>
          <div className="dropdown">
            <button onClick={() => setActiveView(activeView === 'my-products' ? '' : 'my-products')} className={`nav-link ${['add-product', 'my-products'].includes(activeView) ? 'act' : ''}`}>📦 Products</button>
            <div className="dropdown-menu">
              <button onClick={() => setActiveView('add-product')} className={`dropdown-link ${activeView === 'add-product' ? 'act' : ''}`}>➕ Add Product</button>
              <button onClick={() => setActiveView('my-products')} className={`dropdown-link ${activeView === 'my-products' ? 'act' : ''}`}>📃 My Products</button>
            </div>
          </div>
          <button onClick={() => setActiveView('orders')} className={`nav-link ${activeView === 'orders' ? 'act' : ''}`}>🛒 Orders</button>
          <button onClick={() => setActiveView('notifications')} className={`nav-link ${activeView === 'notifications' ? 'act' : ''}`}>🔔 Notifications</button>
          <button onClick={() =>navigate("/profile")} className={`nav-link ${activeView === 'profile' ? 'act' : ''}`}>👤 Profile</button>
        </nav>
      </aside>
      <main className="main-content">
        {renderView()}
      </main>
    </div>
  );
}

export default Dashboard