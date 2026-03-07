import { useContext, useState } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router';
import AddProducts from '../../components/AddProducts/AddProducts';
import SellerProducts from '../../components/SellerProducts/SellerProducts';
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import Overview from '../../components/Overview/Overview';
import SellerOrders from '../../components/SellerOrder/SellerOrders';
import { Menu, ArrowLeft } from "lucide-react";

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [activeSideBar, setActiveSideBar] = useState(false)
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
        return <SellerOrders/>
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
      <nav className='seller-dash-nav'>
        <ul>
          <li onClick={() =>navigate("/")}>
            <ArrowLeft size={24} />
            Back to home
          </li>
        </ul>
        <Menu size={24} className="menu-icon" onClick={() => setActiveSideBar(!activeSideBar)} aria-label="Toggle menu" />
      </nav>
      <div className="main-container">
        <aside className={`sidebar ${activeSideBar ? "show-sb" : ""}`} >
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
          <button onClick={() =>navigate("/profile")} className={`nav-link ${activeView === 'profile' ? 'act' : ''}`}>👤 Profile</button>
        </nav>
      </aside>
      <main className={`main-content ${!activeSideBar ? "full-width" : ""}`}>
        {renderView()}
      </main>
      </div>
    </div>
  );
}

export default Dashboard