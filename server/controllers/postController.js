const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//* CREATE POST
const createPost = async (req, res, next) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.files:", req.files.thumbnail);

    const { title, category, desc } = req.body;
    const thumbnail = req.files?.thumbnail;

    // Validate input
    if (!title) return next(new HttpError("Title is required", 422));
    if (!category) return next(new HttpError("Category is required", 422));
    if (!desc) return next(new HttpError("Description is required", 422));
    if (!thumbnail) return next(new HttpError("Thumbnail is required", 422));

    // Validate file size (2MB limit)
    if (thumbnail.size > 2000000) {
      return next(new HttpError("Image size must be less than 2MB", 422));
    }

    // Upload file to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      thumbnail.tempFilePath, // Use the temporary file path
      { folder: "uploads" } // Optional: Organize into a folder
    );

    console.log("Cloudinary response:",cloudinaryResponse);

    // Create the post with Cloudinary image URL
    const newPost = await Post.create({
      title,
      category,
      desc,
      thumbnail: cloudinaryResponse.secure_url, // Use Cloudinary image URL
      creator: req.user.id,
    });

    // Update user post count
    const currentUser = await User.findById(req.user.id);
    if (currentUser) {
      const userPostCount = currentUser.posts + 1;
      await User.findByIdAndUpdate(
        req.user.id,
        { posts: userPostCount },
        { new: true }
      );
    }

    // Respond with success
    res.status(201).json({
      status: "success",
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    return next(new HttpError(error.message, 500));
  }
};

//* GET ALL POSTS
const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(200).json({ status: "success", posts });
  } catch (error) {
    return next(new HttpError(error));
  }
};

//* GET SINGLE POST
const getSinglePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    // console.log("Request Params for single post:", req?.params?.id);
    const post = await Post.findById(postId);
    // console.log("post id:", post);
    if (!post) {
      return next(new HttpError("Post does not exist", 422));
    }
    res.status(200).json({ status: "success", post });
  } catch (error) {
    console.error("error fetching post:", error);
    return next(new HttpError(error));
  }
};

//* GET POSTS BY CATEGORY
const getPostsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const catPosts = await Post.find({ category }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", catPosts });
  } catch (error) {
    return next(new HttpError(error));
  }
};

//* GET POSTS BY AUTHOR
const getPostsByAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const authorPosts = await Post.find({ creator: id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ status: "success", authorPosts });
  } catch (error) {
    return next(new HttpError(error));
  }
};

//* EDIT POST
const editPost = async (req, res, next) => {
  try {
    let updatedPost;

    const postId = req.params.id;
    const { title, category, desc } = req.body;

    // Validate input fields
    if (!title || !category || !desc || desc.length < 12) {
      return next(
        new HttpError(
          "All fields are required and description must be at least 12 characters long",
          422
        )
      );
    }

    if (!req.files || !req.files.thumbnail) {
      // No new thumbnail provided, update only text fields
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, desc },
        { new: true }
      );
    } else {
      // Handle new thumbnail
      const thumbnail = req.files.thumbnail;

      // Validate thumbnail properties
      if (!thumbnail.name || !thumbnail.data) {
        console.error("Invalid thumbnail object:", thumbnail);
        return next(new HttpError("Invalid thumbnail file", 422));
      }

      if (thumbnail.size > 2000000) {
        return next(new HttpError("Image size must be less than 2MB", 422));
      }

      // Upload the image to Cloudinary
      const cloudinaryResponse = await cloudinary.uploader.upload(thumbnail.tempFilePath, {
        folder: 'your_folder_name', // Optionally specify a folder in Cloudinary
      });

      // Save Cloudinary URL (URL returned from Cloudinary after upload)
      const cloudinaryUrl = cloudinaryResponse.secure_url;

      // Update the post with the new thumbnail URL from Cloudinary
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, desc, thumbnail: cloudinaryUrl },
        { new: true }
      );
    }

    if (!updatedPost) {
      return next(new HttpError("Failed to update post", 422));
    }

    res.status(200).json({ status: "success", post: updatedPost });
  } catch (error) {
    console.error("Error in editPost:", error.message);
    return next(
      new HttpError("Something went wrong, please try again later", 500)
    );
  }
};

//* DELETE POST
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post does not exist", 422));
    }

    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found", 404));
    }

    if (req.user.id != post.creator) {
      return next(new HttpError("You are not authorized to delete this post", 403));
    }

    const fileName = post.thumbnail;

    if (fileName.includes("res.cloudinary.com")) {
      // If the thumbnail is a Cloudinary URL, delete it from Cloudinary
      const publicId = fileName.split('/').pop().split('.')[0]; // Extract Cloudinary public ID
      await cloudinary.uploader.destroy(publicId);
    } else {
      // Otherwise, delete it from the local uploads folder
      fs.unlink(path.join(__dirname, "..", "uploads", fileName), (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting local file:", err);
          return next(new HttpError("Failed to delete local file", 500));
        }
      });
    }

    // Delete the post from the database
    await Post.findByIdAndDelete(postId);

    // Reduce the user's post count by 1
    const currentUser = await User.findById(req.user.id);
    if (currentUser) {
      const userPostCount = Math.max(0, currentUser.posts - 1);
      await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
    }

    res.status(200).json({
      status: "success",
      message: "Post deleted successfully",
      postId,
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    return next(new HttpError("Something went wrong while deleting the post", 500));
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  getPostsByCategory,
  getPostsByAuthor,
  editPost,
  deletePost,
};
