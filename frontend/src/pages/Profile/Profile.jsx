import React, { useContext, useState, useEffect } from 'react';
import './Profile.css';
import { context } from '../../components/Context/Context';
import { FaCamera } from "react-icons/fa";
import OrderCard from '../../components/OrderCard/OrderCard';
import Loading from '../../components/Loading/Loading';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, getLoggedInUser} = useContext(context);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleProfileImageChange = async (e) => {
    setLoading(true)
    const file = e.target.files[0];
    setImage(file);

    const formData = new FormData();
    formData.append("image", file); 

    try {
      const res = await fetch("http://localhost:3000/changeProfileImage", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        getLoggedInUser();
        toast.success("Profile Picture Updated!")
      }
    } catch (error) {
      toast.error("An error occured while updating the image")
      console.log("An error occurred while updating the image: " + error);
    }
    finally{
      setLoading(false)
    }
  };

  const handleUpdateUser = async (e) =>{
    e.preventDefault();
    setLoading(true)
    try {
       const res = await fetch("http://localhost:3000/updateUser", {
        method: "PUT",
        headers:{
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({name, email}),
      });

      if (res.ok) {
        getLoggedInUser();
        toast.success("Info Updated Successfully!")
      }
    } catch (error) {
      toast.error("An error occured while updating the info")
      console.log("An error occurred while updating the user: " + error);
    }
    finally{
      setLoading(false)
    }
  }


  useEffect(() => {
    if (user) {
      setName(user.username);
      setEmail(user.email);
    }
  }, [user]);

  
  if (!user || loading) {
    return <Loading/>
  }

  return (
    <div className='profile'>
      <div className="user-info-side">
        <div className="user-info">
          <label className="profile-pic-label">
            <img src={`http://localhost:3000/uploads/${user.profilePic}`} className="profile-pic" />
            <div className="camera-icon">
              <FaCamera />
            </div>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleProfileImageChange(e)}
            />

          </label>
          <p><span>Name:</span> {user?.username}</p>
          <p><span>Email:</span> {user?.email}</p>
        </div>

        <div className="update-form">
          <h3>Update Your Info</h3>
          <form onSubmit={handleUpdateUser}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit">Update Info</button>
          </form>
        </div>
      </div>
      <div className="orders-side">
        <h3>My Orders</h3>
        <ul className="orders-container">
          <OrderCard />
          <OrderCard />
          <OrderCard />
          <OrderCard />
        </ul>
      </div>
    </div>
  );
};

export default Profile;
