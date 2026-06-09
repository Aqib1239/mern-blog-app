import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/`);
        setAuthors(response?.data?.authors || []); // Fallback to empty array
      } catch (err) {
        setError("Failed to fetch authors. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getAuthors();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      {error ? (
        <p className="error">{error}</p>
      ) : authors.length > 0 ? (
        <div className="container authors_container">
          {authors.map(({ _id: id, avatar, name, posts }) => {
            // Check if the avatar is a Cloudinary URL or a local image path
            const avatarUrl =
              avatar && avatar.startsWith('http')
                ? avatar // If it's a Cloudinary URL or external URL
                : `${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar || "default-avatar.png"}`; // Local fallback

            return (
              <Link key={id} to={`/posts/users/${id}`} className="authors">
                <div className="author_avatar">
                  <img
                    src={avatarUrl}
                    alt="avatar"
                  />
                </div>
                <div className="author_info">
                  <h4>{name || "Unknown Author"}</h4>
                  <p>{posts || 0} posts</p>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <h2 className="center">No Users / Authors Found</h2>
      )}
    </section>
  );
};

export default Authors;

