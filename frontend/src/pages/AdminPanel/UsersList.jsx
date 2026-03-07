import { useEffect, useState, useContext, useRef } from 'react';
import './UsersList.css';
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';
import { MoreVertical } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { BASE_URL } = useContext(context);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [deleteConfirmUser, setDeleteConfirmUser] = useState(null);
  const dropdownRef = useRef(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/users`, {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type, user) => {
    setDropdownOpen(null);
    if (type === 'delete') {
      setDeleteConfirmUser(user);
      return;
    }
    await performAction(type, user);
  };

  const performAction = async (type, user) => {
    try {
      let res;
      if (type === 'block') {
        res = await fetch(`${BASE_URL}/admin/block-user/${user._id}`, {
          method: 'PUT',
          credentials: 'include',
        });
      } else if (type === 'admin' || type === 'seller') {
        res = await fetch(`${BASE_URL}/admin/update-role/${user._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ role: type }),
        });
      } else if (type === 'delete') {
        res = await fetch(`${BASE_URL}/admin/delete-user/${user._id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      }
      if (res?.ok) {
        toast.success(`${type} action successful`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(`Failed to ${type}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteConfirmUser) {
      await performAction('delete', deleteConfirmUser);
      setDeleteConfirmUser(null);
    }
  };

  useEffect(() => {
    fetchUsers();
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

  if (loading) return <Loading />;

  return (
    <div className="admin-users-container">
      <div className="admin-card admin-users-card">
        {users.length === 0 ? (
          <p className="admin-empty-state">No users found.</p>
        ) : (
          <div className="admin-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user._id}>
                    <td>{idx + 1}</td>
                    <td className="admin-table-id">{String(user._id).slice(-8)}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span className={user.isBlocked ? 'admin-pill admin-pill-blocked' : 'admin-pill admin-pill-active'}>
                        {user.isBlocked ? 'Blocked' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-dropdown-wrap" ref={dropdownOpen === user._id ? dropdownRef : null}>
                        <button
                          type="button"
                          className="admin-action-icon-btn"
                          onClick={() => setDropdownOpen(dropdownOpen === user._id ? null : user._id)}
                          aria-label="Options"
                          aria-expanded={dropdownOpen === user._id}
                        >
                          <MoreVertical size={20} />
                        </button>
                        {dropdownOpen === user._id && (
                          <div className="admin-dropdown-menu">
                            <button type="button" onClick={() => handleAction('admin', user)}>Make Admin</button>
                            <button type="button" onClick={() => handleAction('seller', user)}>Make Seller</button>
                            <button type="button" onClick={() => handleAction('block', user)}>
                              {user.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            <button type="button" onClick={() => handleAction('delete', user)} className="admin-dropdown-danger">
                              Delete
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

      <ConfirmModal
        open={!!deleteConfirmUser}
        title="Delete user"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmUser(null)}
      />
    </div>
  );
};

export default UsersList;
