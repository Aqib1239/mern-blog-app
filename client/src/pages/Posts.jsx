
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";
import Loader from "../components/Loader.jsx";

const Posts = () => {
  const [posts, setPosts] = useState([]); // Ensure initial state is an array
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/posts/get-all`);
        const data = await response.json(); // Parse response to JSON
        setPosts(data.posts); // Set parsed data to posts state
        console.log("API Response:", data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, []); 
  
  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
      {posts.length > 0 ? (
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
};

export default Posts;
