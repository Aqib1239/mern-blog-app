import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheck, FaEdit } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import axios from "axios";
import { toast } from "react-toastify";

const UserProfile = () => {
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // Fetch user details (including updated avatar)
  useEffect(() => {
    // Check if the avatar URL is stored in localStorage
    const storedAvatar = localStorage.getItem("userAvatar");
  
    if (storedAvatar) {
      setAvatarUrl(storedAvatar); // If found, use the stored avatar URL
    } else {
      // If no avatar URL is found in localStorage, fetch it from the API
      const getUser = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/users/${currentUser?.id}`,
            { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
          );
  
          const { name, email, avatar } = response.data;
          setName(name);
          setEmail(email);
  
          // If no avatar is set, fall back to a default avatar
          setAvatarUrl(`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar || 'default-avatar.jpg'}`);
        } catch (error) {
          console.error("Error fetching user details: ", error);
          setError(error.response?.data?.message || "Failed to fetch user details.");
        }
      };
  
      getUser();
    }
  }, [currentUser?.id, token]); // Only fetch user info if the currentUser id is available
  
  // Change avatar handler
  const changedAvatarHandler = async () => {
    setIsAvatarTouched(false);
    if (!avatar) {
      setError("Please select a valid avatar file.");
      return;
    }
  
    try {
      const postsData = new FormData();
      postsData.append("avatar", avatar);
  
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/users/change-avatar`,
        postsData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response?.data?.updatedAvatar) {
        const newAvatarUrl = `${process.env.REACT_APP_ASSETS_URL}/uploads/${response.data.updatedAvatar}`;
        // Store the avatar URL in localStorage
        localStorage.setItem("userAvatar", newAvatarUrl);
        setAvatarUrl(newAvatarUrl); // Update state with the new avatar URL
        toast.success("Avatar updated successfully!");
      } else {
        throw new Error("Unexpected response format.");
      }
    } catch (error) {
      console.error("Error changing avatar: ", error);
      // setError(error.response?.data?.message || "Failed to change avatar.");
      toast.error(error.response?.data?.message);
    }
  };
  
  const updateUserDetails = async (e) => {
    e.preventDefault();
  
    try {
      const userData = new FormData();
      userData.set("name", name);
      userData.set("email", email);
      userData.set("currentPassword", currentPassword);
      userData.set("newPassword", newPassword);
      userData.set("confirmPassword", confirmPassword);
  
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/users/edit-user`,
        userData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.status === 200) {
        // Optional: Clear the form fields after successful update
        setName("");
        setEmail("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
  
        navigate("/logout"); // Redirect to logout or wherever you'd like
        toast.success("User details updated successfully!");
      }
    } catch (error) {
      // Handle any error, including when error.response is undefined
      const errorMessage = error.response?.data?.message || "Something went wrong!";
      console.log(errorMessage);
      toast.error(errorMessage);
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
                src={avatarUrl || `${process.env.REACT_APP_ASSETS_URL}/uploads/default-avatar.jpg`} // Default avatar fallback
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
              <button
                className="profile_avatar-btn"
                onClick={changedAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>

          <h1>{currentUser?.name}</h1>

          {/* Form to update user details */}
          <form className="form profile_form" onSubmit={updateUserDetails}>
            {error && <p className="form_error-message">{error}</p>}
            <input
              type="text"
              placeholder="Full Name"
              value={name || ""}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email || ""}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword || ""}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword || ""}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword || ""}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

