import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Loader from '../components/Loader';
import axios from 'axios';
import DeletePost from './DeletePost';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  // Redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/authors/${currentUser.id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPosts(response.data.authorPosts);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [currentUser.id, token]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className='dashboard'>
      {posts.length > 0 ? (
        <div className="container dashboard_container">
          {posts.map((post, index) => {
            // Check if the thumbnail is from Cloudinary or local file
            const imageUrl =
              post.thumbnail && post.thumbnail.startsWith('http')
                ? post.thumbnail // If it's a Cloudinary URL or external URL
                : `${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`; // Local fallback

            return (
              <article key={post._id || index} className='dashboard_post'>
                <div className="dashboard_post-info">
                  <div className="dashboard_post-thumbnail">
                    <img src={imageUrl} alt={post.title} />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard_post-actions">
                  <Link to={`/posts/${post._id}`} className='btn sm secondary'>
                    View
                  </Link>
                  <Link to={`/posts/${post._id}`} className='btn sm primary'>
                    Edit
                  </Link>
                  <DeletePost postID={post._id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">You have no Posts yet.</h2>
      )}
    </section>
  );
};

export default Dashboard;
