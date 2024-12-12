const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");
const jwt = require("jsonwebtoken");

//* CREATE POST
const createPost = async (req, res, next) => {
  try {
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { title, category, desc } = req.body;
    const thumbnail = req.file || req.files?.thumbnail;

    if (!title) return next(new HttpError("Title is required", 422));
    if (!category) return next(new HttpError("Category is required", 422));
    if (!desc) return next(new HttpError("Description is required", 422));
    if (!thumbnail) return next(new HttpError("Thumbnail is required", 422));

    if (thumbnail.size > 2000000) {
      return next(new HttpError("Image size must be less than 2MB", 422));
    }

    let fileName = thumbnail.name;
    let splittedFileName = fileName.split(".");
    if (splittedFileName.length < 2) {
      return next(new HttpError("Invalid file name", 400));
    }

    let newFileName = `${splittedFileName[0]}.${uuid()}.${
      splittedFileName[splittedFileName.length - 1]
    }`;
    try {
      await thumbnail.mv(path.join(__dirname, "..", "/uploads", newFileName));

      const newPost = await Post.create({
        title,
        category,
        desc,
        thumbnail: newFileName,
        creator: req.user.id,
      });
      if (!newPost) {
        return next(new HttpError("Failed to create post", 500));
      }

      const currentUser = await User.findById(req.user.id);
      if (currentUser) {
        const userPostCount = currentUser.posts + 1;
        await User.findByIdAndUpdate(
          req.user.id,
          { posts: userPostCount },
          { new: true }
        );
      }

      res.status(201).json({
        status: "success",
        message: "Post created successfully",
        post: newPost,
      });
    } catch (error) {
      return next(new HttpError(error.message, 500));
    }
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
    let fileName;
    let newFileName;
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

      // Generate a unique filename
      fileName = thumbnail.name;
      const splittedFileName = fileName.split(".");
      newFileName =
        splittedFileName[0] +
        uuid() +
        "." +
        splittedFileName[splittedFileName.length - 1];

      // Save the file
      thumbnail.mv(
        path.join(__dirname, "..", "uploads", newFileName),
        async (err) => {
          if (err) {
            console.error("Error saving thumbnail:", err);
            return next(new HttpError("Failed to upload file", 500));
          }
        }
      );

      // Update the post with the new thumbnail
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, category, desc, thumbnail: newFileName },
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

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return next(new HttpError("Post does not exist", 422));
    }
    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;
    if (req.user.id == post?.creator) {
      // delete thumbnail from uploads folder
      fs.unlink(
        path.join(__dirname, "..", "/uploads", fileName),
        async (err) => {
          if (err) {
            return next(new HttpError(err));
          } else {
            await Post.findByIdAndDelete(postId);
            // find user and reduce post count by 1
            const currentUser = await User.findById(req.user.id);
            const userPostCount = currentUser?.posts - 1;
            await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
            res.status(200).json({
              status: "success",
              message: "Post deleted successfully",
              postId,
            });
          }
        }
      );
    } else {
      return next(new HttpError("Post could not be deleted", 403));
    }
  } catch (error) {
    return next(new HttpError(error));
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
