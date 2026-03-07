import React, { useEffect, useState, useContext, useRef } from 'react';
import './SellersList.css';
import { context } from '../../components/Context/Context';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading/Loading';
import { MoreVertical } from 'lucide-react';

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [sellerApplications, setSellerApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { BASE_URL } = useContext(context);
  const dropdownRef = useRef(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [sellersRes, appsRes] = await Promise.all([
        fetch(`${BASE_URL}/admin/sellers`, { credentials: 'include' }),
        fetch(`${BASE_URL}/admin/seller-applications`, { credentials: 'include' }),
      ]);
      if (sellersRes.ok) {
        const data = await sellersRes.json();
        setSellers(data);
      }
      if (appsRes.ok) {
        const data = await appsRes.json();
        setSellerApplications(data);
      }
    } catch (err) {
      console.error('Error fetching sellers/applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateSellerStatus = async (id, action) => {
    setDropdownOpen(null);
    try {
      const res = await fetch(`${BASE_URL}/admin/update-seller/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        toast.success('Seller updated successfully');
        fetchAll();
      } else {
        toast.error('Failed to update seller');
      }
    } catch (err) {
      toast.error('Error occurred while updating seller');
    }
  };

  const updateSellerApplicationStatus = async (id, userId, action) => {
    setDropdownOpen(null);
    try {
      const res = await fetch(`${BASE_URL}/admin/update-seller-application-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action, userId }),
      });
      if (res.ok) {
        toast.success('Seller application status updated successfully');
        fetchAll();
      } else {
        toast.error('Failed to update seller application status');
      }
    } catch (err) {
      toast.error('Error occurred while updating seller application status');
    }
  };

  const openKey = (type, id) => `${type}-${id}`;

  if (loading) return <Loading />;

  return (
    <div className="admin-sellers-container">
      <div className="admin-card admin-sellers-card">
        <h3 className="admin-section-title">Sellers</h3>
        {sellers.length === 0 ? (
          <p className="admin-empty-state">No sellers found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Store</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((seller, index) => (
                  <tr key={seller._id}>
                    <td>{index + 1}</td>
                    <td>{seller.storeInfo?.storeName ?? '—'}</td>
                    <td>{seller.email}</td>
                    <td>
                      <span className={seller.isBlocked ? 'admin-pill admin-pill-blocked' : 'admin-pill admin-pill-active'}>
                        {seller.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>{seller.role}</td>
                    <td>
                      <div className={`admin-dropdown-wrap ${dropdownOpen === openKey('s', seller._id) ? 'admin-dropdown-wrap-open' : ''}`} ref={dropdownOpen === openKey('s', seller._id) ? dropdownRef : null}>
                        <button
                          type="button"
                          className="admin-action-icon-btn"
                          onClick={() => setDropdownOpen(dropdownOpen === openKey('s', seller._id) ? null : openKey('s', seller._id))}
                          aria-label="Options"
                          aria-expanded={dropdownOpen === openKey('s', seller._id)}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {dropdownOpen === openKey('s', seller._id) && (
                          <div className="admin-dropdown-menu">
                            <button type="button" onClick={() => updateSellerStatus(seller._id, 'block')}>Block</button>
                            <button type="button" onClick={() => updateSellerStatus(seller._id, 'unblock')}>Unblock</button>
                            <button type="button" onClick={() => updateSellerStatus(seller._id, 'make-user')}>Make User</button>
                            <button type="button" onClick={() => updateSellerStatus(seller._id, 'make-admin')}>Make Admin</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="admin-card admin-sellers-card">
        <h3 className="admin-section-title">Seller Applications</h3>
        {sellerApplications.length === 0 ? (
          <p className="admin-empty-state">No seller applications found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Store</th>
                  <th>Application Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellerApplications.map((app, index) => (
                  <tr key={app._id}>
                    <td>{index + 1}</td>
                    <td>
                      <span className="admin-seller-store-cell">
                        <img className="admin-seller-store-img" src={`${BASE_URL}/uploads/${app.storeBanner}`} alt="" loading="lazy" />
                        {app.storeName}
                      </span>
                    </td>
                    <td>
                      <span className="admin-pill admin-pill-processing">{app.status}</span>
                    </td>
                    <td>
                      <div className={`admin-dropdown-wrap ${dropdownOpen === openKey('a', app._id) ? 'admin-dropdown-wrap-open' : ''}`} ref={dropdownOpen === openKey('a', app._id) ? dropdownRef : null}>
                        <button
                          type="button"
                          className="admin-action-icon-btn"
                          onClick={() => setDropdownOpen(dropdownOpen === openKey('a', app._id) ? null : openKey('a', app._id))}
                          aria-label="Options"
                          aria-expanded={dropdownOpen === openKey('a', app._id)}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {dropdownOpen === openKey('a', app._id) && (
                          <div className="admin-dropdown-menu">
                            <button type="button" onClick={() => updateSellerApplicationStatus(app._id, app.userId, 'approved')}>
                              Approve
                            </button>
                            <button type="button" onClick={() => updateSellerApplicationStatus(app._id, app.userId, 'rejected')}>
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
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

export default SellersList;
