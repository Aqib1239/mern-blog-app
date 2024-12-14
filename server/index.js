const express = require('express');
const { connect } = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    credentials: true,
    origin: 'https://mern-blog-app-olive.vercel.app',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);
app.use(
  fileUpload({
    useTempFiles: true, // Save files temporarily
    tempFileDir: '/tmp/', // Directory for temporary files
  })
);

// Static file serving for local uploads (fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Middleware for handling not-found and other errors
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start the server
connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

module.exports = app;
