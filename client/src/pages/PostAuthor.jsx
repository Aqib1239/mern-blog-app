import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState(null); // Start with null to handle loading state
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/users/${authorID}`
        );
        setAuthor(response?.data?.user);
      } catch (error) {
        console.log(error);
        setAuthor({ name: "Unknown Author", avatar: null }); // Handle error gracefully
      } finally {
        setLoading(false); // Set loading to false after request completion
      }
    };
    getAuthor();
  }, [authorID]);

  // If the author data is still loading
  if (loading) {
    return <div>Loading author...</div>;
  }

  // Construct avatar URL with fallback if avatar is missing or not from Cloudinary
  const avatarURL = author?.avatar
    ? author?.avatar.includes("res.cloudinary.com") // Check if URL is from Cloudinary
      ? author?.avatar // If it is from Cloudinary, use the full URL
      : `${process.env.REACT_APP_ASSETS_URL}/uploads/${author?.avatar}` // Use server URL if it's not Cloudinary
    : "/default-avatar.png"; // Default avatar fallback if no avatar is set

  return (
    <Link to={`/posts/users/${authorID}`} className="post_author">
      <div className="post_author-avatar">
        <img
          src={avatarURL}
          alt={`${author?.name}'s avatar`}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop if fallback fails
            e.target.src = "/default-avatar.png"; // Fallback to default avatar on error
          }}
        />
      </div>
      <div className="post_author-details">
        <h5>By: {author?.name}</h5>
        <small>
          <ReactTimeAgo date={new Date(createdAt)} locale="en-US" />
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;
