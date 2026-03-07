import { useContext, useState, useRef, useEffect } from 'react';
import './AdminPanel.css';
import { Menu, X, LayoutDashboard, Users, Store, Package, ShoppingCart } from "lucide-react";
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import AdminDashboard from './AdminDashboard';
import UsersList from './UsersList';
import SellersList from './SellersList';
import ProductsList from './ProductsList';
import OrdersList from './OrdersList';

const VIEW_TITLES = {
  dashboard: 'Dashboard',
  users: 'Manage Users',
  sellers: 'Manage Sellers',
  products: 'Manage Products',
  orders: 'All Orders',
};

const AdminPanel = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const { user, BASE_URL, loading } = useContext(context);
  const [activeSideBar, setActiveSideBar] = useState(false);
  const sidebarRef = useRef(null);

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
        return <OrdersList />;
      default:
        return null;
    }
  };

  const goTo = (view) => {
    setActiveView(view);
    setActiveSideBar(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target) && activeSideBar) {
        setActiveSideBar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSideBar]);

  if (loading || !user) return <Loading />;

  return (
    <div className="admin-dashboard-container">
      <aside className={`admin-sidebar ${activeSideBar ? 'admin-sidebar-open' : ''}`} ref={sidebarRef}>
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-title">VendorBay Admin</span>
          <button
            type="button"
            className="admin-sidebar-close"
            onClick={() => setActiveSideBar(false)}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>
        <div className="admin-info">
          <img src={`${BASE_URL}/uploads/${user.profilePic}`} alt="Admin" loading="lazy" />
          <h3>{user.username}</h3>
        </div>
        <nav className="admin-nav-menu">
          <button type="button" onClick={() => goTo('dashboard')} className={`admin-nav-link ${activeView === 'dashboard' ? 'admin-nav-link-active' : ''}`}>
            <LayoutDashboard size={20} aria-hidden /> Dashboard
          </button>
          <button type="button" onClick={() => goTo('users')} className={`admin-nav-link ${activeView === 'users' ? 'admin-nav-link-active' : ''}`}>
            <Users size={20} aria-hidden /> Manage Users
          </button>
          <button type="button" onClick={() => goTo('sellers')} className={`admin-nav-link ${activeView === 'sellers' ? 'admin-nav-link-active' : ''}`}>
            <Store size={20} aria-hidden /> Manage Sellers
          </button>
          <button type="button" onClick={() => goTo('products')} className={`admin-nav-link ${activeView === 'products' ? 'admin-nav-link-active' : ''}`}>
            <Package size={20} aria-hidden /> Manage Products
          </button>
          <button type="button" onClick={() => goTo('orders')} className={`admin-nav-link ${activeView === 'orders' ? 'admin-nav-link-active' : ''}`}>
            <ShoppingCart size={20} aria-hidden /> Manage Orders
          </button>
        </nav>
      </aside>

      {activeSideBar && <div className="admin-sidebar-backdrop" aria-hidden onClick={() => setActiveSideBar(false)} />}

      <div className="admin-main-wrap">
        <header className="admin-topbar">
          <button type="button" className="admin-menu-btn" onClick={() => setActiveSideBar(!activeSideBar)} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
          <h1 className="admin-page-title">{VIEW_TITLES[activeView]}</h1>
        </header>

        <main className="admin-main-content">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
