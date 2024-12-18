import React, { useEffect, useState } from 'react'
import PostItem from './PostItem';
import Loader from '../components/Loader';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]); // Ensure initial state is an array
  const [isLoading, setIsLoading] = useState(false);

  const {category} = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/categories/${category}`);
        // const data = await response.json(); // Parse response to JSON
        setPosts(response?.data.catPosts); // Set parsed data to posts state
        console.log("API Response Category Posts:", response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [category]); // Add an empty dependency array to ensure this runs only once

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {posts && posts.length > 0 ? (
        <div className="container posts_container">
          {posts.map(({ _id: id, thumbnail, category, title, desc, creator, createdAt }) => (
            <PostItem
              key={id}
              postID={id}
              thumbnail={thumbnail}
              category={category}
              title={title}
              desc={desc}
              authorID={creator}
              createdAt={createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className="center">No Posts found</h2>
      )}
    </section>
  );
}

export default CategoryPosts;