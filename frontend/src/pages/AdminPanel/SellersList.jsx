import React, { useEffect, useState, useContext } from "react";
import "./SellersList.css";
import { context } from "../../components/Context/Context";
import { toast } from "react-toastify";
import Loading from "../../components/Loading/Loading";

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [sellerApplications, setSellerApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { BASE_URL } = useContext(context);

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/sellers`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSellers(data);
      }
    } catch (err) {
      console.error("Error fetching sellers:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/admin/seller-applications`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setSellerApplications(data);
      }
    } catch (err) {
      console.error("Error fetching seller applications:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchSellers();
    fetchSellerApplications();
  }, []);

  const updateSellerStatus = async (id, action) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/update-seller/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action }),
      });

      if (res.ok) {
        toast.success("Seller updated successfully");
        fetchSellers();
      } else {
        toast.error("Failed to update seller");
      }
    } catch (err) {
      console.error("Error updating seller:", err);
      toast.error("Error occurred while updating seller");
    }
  };

   const updateSellerApplicationStatus = async (id, userId, action) => {
    try {
      const res = await fetch(`${BASE_URL}/admin/update-seller-application-status/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, userId }),
      });

      if (res.ok) {
        toast.success("Seller application status updated successfully");
        fetchSellers();
        fetchSellerApplications();
      } else {
        toast.error("Failed to update seller appliaction status");
      }
    } catch (err) {
      console.error("Error updating seller appliaction status:", err);
      toast.error("Error occurred while updating seller application status");
    }
  };


  if(loading){
    return <p>Loading...</p>
  }

  return (
    <div className="admin-sellers-container">
      <h2>Manage Sellers</h2>
      {
        sellers.length === 0 ? (
        <p>No sellers found.</p>
      ) : (
        <table className="admin-seller-table">
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
                <td>{seller.storeInfo.storeName}</td>
                <td>{seller.email}</td>
                <td>{seller.isBlocked ? "Blocked" : "Active"}</td>
                <td>{seller.role}</td>
                <td>
                  <div className="dropdown-wrapper">
                    <button className="action-btn">⋮</button>
                    <div className="dropdown-menu-sellers">
                      <button onClick={() => updateSellerStatus(seller._id, "block")}>
                        Block
                      </button>
                      <button onClick={() => updateSellerStatus(seller._id, "unblock")}>
                        Unblock
                      </button>
                      <button onClick={() => updateSellerStatus(seller._id, "make-user")}>
                        Make User
                      </button>
                      <button onClick={() => updateSellerStatus(seller._id, "make-admin")}>
                        Make Admin
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
     <div className="seller-app-sec">
        <h2>Seller Applications</h2>
         {
        sellerApplications.length === 0 ? (
        <p>No seller applications found.</p>
      ) : (
        <table className="admin-seller-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Store</th>
              <th>Application Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellerApplications.map((seller, index) => (
              <tr key={seller._id}>
                <td>{index + 1}</td>
                <td><span><img className="store-banner" src={`${BASE_URL}/uploads/${seller.storeBanner}`} loading="lazy" /> {seller.storeName}</span></td>
                <td>{seller.status}</td>
                <td>
                  <div className="dropdown-wrapper">
                    <button className="action-btn">⋮</button>
                    <div className="dropdown-menu-sellers">
                      <button onClick={() => updateSellerApplicationStatus(seller._id, seller.userId, "approved")}>
                        Approve
                      </button>
                      <button onClick={() => updateSellerApplicationStatus(seller._id, seller.userId, "rejected")}>
                        Reject
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
     </div>
    </div>
  );
};

export default SellersList;
