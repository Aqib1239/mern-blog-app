import React, { useEffect, useState } from 'react';
import PostItem from './PostItem';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const AuthorPosts = () => {
  const [posts, setPosts] = useState([]); // Ensure initial state is an array
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/authors/${id}`);
        setPosts(response?.data.authorPosts); // Set parsed data to posts state
        console.log("API Response:", response.data); // Check if thumbnail data is valid
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [id]); // Re-fetch posts when `id` changes

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {posts && posts.length > 0 ? (
        <div className="container posts_container">
          {posts.map(({ _id: id, thumbnail, category, title, desc, creator, createdAt }) => {
            // Debugging: log the thumbnail to check what it contains
            console.log("Post thumbnail:", thumbnail);

            // Check if thumbnail is a Cloudinary URL or a local file
            const imageUrl = thumbnail && (thumbnail.startsWith('http') || thumbnail.includes('cloudinary'))
              ? thumbnail // If it's a valid URL, assume it's Cloudinary or external
              : `${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail || 'default-avatar.jpg'}`; // Local fallback

            console.log("Final image URL:", imageUrl); // Check what URL is being passed

            return (
              <PostItem
                key={id}
                postID={id}
                thumbnail={imageUrl} // Pass the correct image URL to PostItem
                category={category}
                title={title}
                desc={desc}
                authorID={creator}
                createdAt={createdAt}
              />
            );
          })}
        </div>
      ) : (
        <h2 className="center">No Posts found</h2>
      )}
    </section>
  );
}

export default AuthorPosts;
