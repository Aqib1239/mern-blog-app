# Blog Application Assignment

## Overview
This project is a blog application built using the MERN stack (MongoDB, Express.js, React, Node.js). The application allows users to register, log in, and manage blog posts. Users can create, read, update, and delete (CRUD) posts as well as upload profile pictures. The project is deployed using Vercel (frontend) and Vercel Serverless Functions (backend). Cloudinary is used for image upload instead of AWS S3.

---

## Features
### User Authentication
- User registration and login.
- Passwords are securely hashed using `bcrypt`.
- JSON Web Tokens (JWT) are used for securing endpoints.

### Post Management
- Authenticated users can create, update, and delete posts.
- Posts include a title, content, and timestamp.
- Public access to view all posts or a specific post.

### Image Upload
- Users can upload profile pictures and post images.
- Images are stored on Cloudinary.

### Deployment
- Frontend and backend deployed on Vercel.

---

## Installation Instructions
### Prerequisites
- Node.js (version 16 or higher)
- MongoDB instance (local or cloud-based, e.g., MongoDB Atlas)
- Cloudinary account (for image storage)

### Backend Setup
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd blog-application-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-cloud-name>
   CLOUDINARY_API_KEY=<your-cloudinary-api-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-api-secret>
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../blog-application-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the following:
   ```env
   REACT_APP_BACKEND_URL=<backend-api-url>
   ```
4. Start the development server:
   ```bash
   npm start
   ```

---

## Deployment
### Vercel Deployment
#### Backend
1. Navigate to the backend directory.
2. Deploy the backend using Vercel:
   ```bash
   vercel deploy
   ```
3. Configure environment variables on Vercel.

#### Frontend
1. Navigate to the frontend directory.
2. Deploy the frontend using Vercel:
   ```bash
   vercel deploy
   ```
3. Configure environment variables on Vercel.

---

## API Endpoints
### User Authentication
- `POST /api/register`: Register a new user.
- `POST /api/login`: Authenticate a user and return a JWT.

### Post Management
- `POST /api/posts`: Create a new post (authenticated users only).
- `GET /api/posts`: Retrieve all posts (publicly accessible).
- `GET /api/posts/:id`: Retrieve a single post by ID (publicly accessible).
- `PUT /api/posts/:id`: Update a post by ID (authenticated users only).
- `DELETE /api/posts/:id`: Delete a post by ID (authenticated users only).

---
