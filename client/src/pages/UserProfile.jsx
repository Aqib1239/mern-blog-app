import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaEdit } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for unauthorized users
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch user details when currentUser changes (including avatar)
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${currentUser.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const avatar = response.data?.user?.avatar;
        const finalAvatarUrl = avatar || `${process.env.REACT_APP_ASSETS_URL}/uploads/default-avatar.jpg`;

        // Update avatar state and localStorage
        localStorage.setItem("userAvatar", finalAvatarUrl);
        setAvatarUrl(finalAvatarUrl);
      } catch (error) {
        console.error("Error fetching user details: ", error);
        toast.error("Failed to fetch user details.");
      }
    };

    fetchUserDetails();
  }, [currentUser, token]); // Ensure this runs whenever currentUser changes

  // Handle Avatar Change
  const changedAvatarHandler = async () => {
    setIsAvatarTouched(false);
    if (!avatar) {
      toast.error("Please select a valid avatar file.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        formData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      if (response?.data?.updatedAvatar) {
        const newAvatarUrl = response.data.updatedAvatar;

        // Save the updated avatar URL to localStorage and state
        localStorage.setItem("userAvatar", newAvatarUrl);
        setAvatarUrl(newAvatarUrl);

        toast.success("Avatar updated successfully!");
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error changing avatar: ", error);
      toast.error(error.response?.data?.message || "Failed to change avatar.");
    }
  };

  // Handle User Detail Updates
  const handleUserUpdate = async (e) => {
    e.preventDefault();

    if (userData.newPassword !== userData.confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("User details updated successfully!");
        navigate("/logout");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user details.");
    }
  };

  return (
    <section className="profile">
      <div className="container profile_container">
        <Link to={`/myposts/${currentUser?.id}`} className="btn">
          My Posts
        </Link>
        <div className="profile_details">
          <div className="avatar_wrapper">
            <div className="profile_avatar">
              <img
                src={avatarUrl || `${process.env.REACT_APP_ASSETS_URL}/uploads/default-avatar.jpg`}
                alt="User Avatar"
              />
            </div>
            {/* Form to Update Avatar */}
            <form className="avatar_form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files[0])}
                accept="image/png, image/jpg, image/jpeg"
              />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>
            {isAvatarTouched && (
              <button className="profile_avatar-btn" onClick={changedAvatarHandler}>
                <FaCheck />
              </button>
            )}
          </div>

          <h1>{currentUser?.name}</h1>

          {/* Form to update user details */}
          <form className="form profile_form" onSubmit={handleUserUpdate}>
            <input
              type="text"
              placeholder="Full Name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={userData.currentPassword}
              onChange={(e) => setUserData({ ...userData, currentPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="New Password"
              value={userData.newPassword}
              onChange={(e) => setUserData({ ...userData, newPassword: e.target.value })}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={userData.confirmPassword}
              onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
            />
            <button className="btn primary" type="submit">
              Update Details
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
