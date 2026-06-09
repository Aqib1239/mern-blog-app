import React, { useState, useEffect, useContext } from 'react';
import PostAuthor from './PostAuthor';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Loader from '../components/Loader';
import DeletePost from './DeletePost';
import axios from 'axios';

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/post/${id}`);
        setPost(response?.data?.post);
        console.log("Api Response PostDetails :",response?.data?.post);
      } catch (error) {
        console.error("Error fetching post:", error);
        setError("Failed to fetch post details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getPost();
  }, [id]);

  if (isLoading) return <Loader />;

  // Construct image URL with conditional logic
  const imageUrl = post?.thumbnail ? 
    (post.thumbnail.includes("res.cloudinary.com") ? 
      post.thumbnail : 
      `${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`
    ) : 'path/to/default/image.jpg';

  return (
    <section className='post-detail'>
      {error && <p className='error'>{error}</p>}
      {post && <div className="container post-detail_container">
        <div className='post-detail_header'>
          <PostAuthor authorID={post?.creator} createdAt={post?.createdAt} />
          {currentUser?.id === post?.creator && <div className="post-detail_buttons">
            <Link to={`/posts/${post?._id}/edit`} className='btn sm primary'>Edit</Link>
            <DeletePost postID={post?._id} />
          </div>}
        </div>
        <h1>{post?.title}</h1>
        <div className="post-detail_thumbnail">
          <img src={imageUrl} alt={post?.title} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post?.desc }} />
       </div>
      }
    </section>
  )
}

export default PostDetails;
