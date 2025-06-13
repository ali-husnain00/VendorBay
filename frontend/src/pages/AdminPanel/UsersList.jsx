import { useEffect, useState, useContext } from 'react';
import './UsersList.css';
import { context } from '../../components/Context/Context';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const { BASE_URL } = useContext(context);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);

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
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type, user) => {
    try {
      let res;
      if (type === 'delete') {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        res = await fetch(`${BASE_URL}/admin/delete-user/${user._id}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } else if (type === 'block') {
        res = await fetch(`${BASE_URL}/admin/block-user/${user._id}`, {
          method: 'PUT',
          credentials: 'include',
        });
      } else if (type === 'admin' || type === 'seller') {
        res = await fetch(`${BASE_URL}/admin/update-role/${user._id}`, {
          method: 'PUT',
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify({ role: type }),
        });
      }

      if (res.ok) {
        toast.success(`${type} action successful`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(`Failed to ${type}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="admin-users-container">
      <h2>Manage Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table className="users-table">
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
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.isBlocked ? "Blocked" : "Active"}</td>
                <td>
                  <div className="dropdown-container">
                    <button className="dropdown-toggle" onClick={() => setDropdownOpen(dropdownOpen === user._id ? null : user._id)}>
                      ⚙️ Options
                    </button>
                    {dropdownOpen === user._id && (
                      <div className="dropdown-menu-users">
                        <button onClick={() => handleAction('admin', user)}>Make Admin</button>
                        <button onClick={() => handleAction('seller', user)}>Make Seller</button>
                        <button onClick={() => handleAction('block', user)}>
                          {user.isBlocked ? 'Unblock' : 'Block'}
                        </button>
                        <button onClick={() => handleAction('delete', user)} className="danger">Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UsersList;
