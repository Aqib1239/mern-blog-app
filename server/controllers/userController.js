const bcrypt = require("bcryptjs");
const HttpError = require("../models/errorModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");


// * REGISTER NEW USER
const registerUser = async (req, res, next) => {
    try {
        const {name, email, password, confirmPassword} = req.body;

        if(!name || !email || !password || !confirmPassword) {
            return next(new HttpError("All fields are required", 422));
        }

        const newEmail = email?.toLowerCase?.();

        const emailExists = await User.findOne({email: newEmail});

        if(emailExists) {
            return next(new HttpError("Email already exists", 422));
        }

        if((password.trim()).length < 6) {
            return next(new HttpError("Password must be at least 6 characters", 422));
        }

        if(password !== confirmPassword) {
            return next(new HttpError("Passwords do not match", 422));
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
        name,
        email: newEmail,
        password: hashedPassword
    });
    res.status(201).json({status: "success", message: `Your Registration Successfully`, newUser});

    } catch (error) {
        console.error("Registration Error:", error);
        return next(new HttpError(error.message || "User registration failed", 500));
    }
}

// * LOGIN USER
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new HttpError("All fields are required", 422));
    }
    const newEmail = email.toLowerCase();
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(new HttpError("User does not exist", 422));
    }
    const comparePassword = await bcrypt.compare(password, user.password);
    if (!comparePassword) {
      return next(
        new HttpError("Invalid password. Please check your credentials", 422)
      );
    }
    const { _id: id, name } = user;
    const token = jwt.sign({ id, name }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res
      .status(200)
      .json({
        status: "success",
        message: `Welcome back ${user.name}`,
        token,
        id,
        name,
      });
  } catch (error) {
    return next(
      new HttpError("User login failed. Please check your credentials", 422)
    );
  }
};

// * USER PROFILE
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return next(new HttpError("User does not exist", 422));
    }
    res.status(200).json({ status: "success", user });
  } catch (error) {
    return next(new HttpError(error));
  }
};

// * GET AUTHORS
const getAuthors = async (req, res, next) => {
  try {
    // Fetch all authors excluding sensitive data like passwords
    const authors = await User.find().select("-password");
    
    res.json({ status: "success", authors });
  } catch (error) {
    console.error("Error fetching authors:", error);
    return next(new HttpError("Failed to fetch authors. Please try again later.", 500));
  }
};


// * CHANGE USER PROFILE PICTURE
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files || !req.files.avatar) {
      return next(
        new HttpError("No file uploaded! Please choose an image.", 422)
      );
    }

    const avatar = req.files.avatar;

    // Check file size
    if (avatar.size > 5 * 1024 * 1024) {
      return next(new HttpError("Image size must be less than 5MB.", 422));
    }

    // Generate a new file name
    const fileExtension = avatar.name.split(".").pop();
    const newFileName = `${
      avatar.name.split(".")[0]
    }-${uuid()}.${fileExtension}`;

    // Save file to the uploads folder
    const uploadPath = path.join(__dirname, "..", "uploads", newFileName);
    avatar.mv(uploadPath, async (err) => {
      if (err) {
        return next(new HttpError("Failed to upload file.", 500));
      }

      // Update user in database
      const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        { avatar: newFileName },
        { new: true }
      );

      if (!updatedUser) {
        return next(new HttpError("Avatar could not be updated.", 422));
      }

      res.status(200).json({
        status: "success",
        message: "Avatar updated successfully",
        updatedAvatar: updatedUser.avatar,
      });
    });
  } catch (error) {
    return next(new HttpError(error.message || "Something went wrong.", 500));
  }
};

// * EDIT USER DETAILS
const editUser = async (req, res, next) => {
  try {
    console.log(req.body);
    const { name, email, currentPassword, newPassword, confirmPassword } = req.body;

    // Check if all fields are provided
    if (!name || !email || !currentPassword || !newPassword || !confirmPassword) {
      return next(new HttpError("All fields are required", 422));
    }

    // Get user from database
    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new HttpError("User does not exist", 422));
    }

    // Ensure the email doesn't already exist (and isn't the same as the user's current email)
    const emailExist = await User.findOne({ email });
    if (emailExist && emailExist._id.toString() !== req.user.id) {
      return next(new HttpError("Email already exists", 422));
    }

    // Compare current password with the one in the database
    const validatePassword = await bcrypt.compare(currentPassword, user.password);
    if (!validatePassword) {
      return next(new HttpError("Invalid current password. Please check your credentials", 422));
    }

    // Ensure new passwords match
    if (newPassword !== confirmPassword) {
      return next(new HttpError("New Passwords do not match", 422));
    }

    // Optional: Check for password strength (if necessary)
    // Add your password strength check here (e.g., length, special characters, etc.)

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    // Update user info in the database
    const newInfo = await User.findByIdAndUpdate(
      req.user.id,
      { name, email, password: hash },
      { new: true }
    );

    // Send success response
    res.status(200).json({
      status: "success",
      message: "User info updated successfully",
      newInfo,
    });
  } catch (error) {
    // Ensure error message is handled properly
    return next(new HttpError(error.message || "Something went wrong.", 500));
  }
};


module.exports = {
  registerUser,
  loginUser,
  getUser,
  changeAvatar,
  editUser,
  getAuthors,
};
