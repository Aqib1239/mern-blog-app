import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';

const PostItem = ({ postID, category, title, desc, authorID, thumbnail, createdAt }) => {
  const shortDesc = desc ? (desc.length > 145 ? desc.substr(0, 145) + '...' : desc) : "No description available.";
  const postTitle = title ? (title.length > 30 ? title.substr(0, 30) + '...' : title) : "Untitled";
  const postCategory = category || "Uncategorized";


  // Construct the image URL with conditional logic
  const imageUrl = thumbnail ? 
  (thumbnail.includes("res.cloudinary.com") ? 
    thumbnail : 
    `${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`
  ) : 'path/to/default/image.jpg';

  return (
    <article className='post'>
      <div className="post_thumbnail">
        <img 
          src={imageUrl} 
          alt={postTitle} 
          onError={(e) => { e.target.onerror = null; e.target.src = 'path/to/placeholder/image.jpg'; }} 
        />
      </div>

      <div className="post_content">
        <Link to={`/posts/${postID}`}>
          <h3>{postTitle}</h3> 
        </Link>
        <p dangerouslySetInnerHTML={{ __html: shortDesc }} />
        <div className="post_footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/posts/categories/${postCategory}`} className='btn category'>
            {postCategory}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
