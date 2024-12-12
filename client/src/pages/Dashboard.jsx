import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Loader from '../components/Loader';
import axios from 'axios';
import DeletePost from './DeletePost';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  // const {id} = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;

  console.log("currentUser :" ,currentUser.id);

  // redirect to login page for any user who is not logged in
  useEffect(() => {
    if(!token) {
      navigate('/login');
    }
  });

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/authors/${currentUser.id}`, {
          withCredentials: true,
          headers: {Authorization: `Bearer ${token}`}          
        })
        setPosts(response.data.authorPosts);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    }

    fetchPosts();
  },[currentUser.id, token]);

  if(isLoading) {
    return <Loader />;
  }

  return (
    <section className='dashboard'>
      {
        posts.length > 0 ? <div className="container dashboard_container">
          {posts.map((post, index) => {;
            return <article key={post._id || index} className='dashboard_post'>
              <div className="dashboard_post-info">
                <div className="dashboard_post-thumbnail">
                  <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
                </div>
                <h5>{post.title}</h5>
              </div>
              <div className="dashboard_post-actions">
                <Link to={`/posts/${post._id}`} className='btn sm secondary'>View</Link>
                <Link to={`/posts/${post._id}`} className='btn sm primary'>Edit</Link>
                <DeletePost postID={post._id} />
              </div>
            </article>
          })}
        </div> : <h2 className="center">You have no Posts yet.</h2>
      }
    </section>
  );
}

export default Dashboard;