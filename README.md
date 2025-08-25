# mern-blog-app

![React](https://img.shields.io/badge/-React-blue?logo=react&logoColor=white)

## 📝 Description

Develop a full-stack blog application using the MERN stack. This project leverages React for a dynamic and responsive user interface. Key features include database integration for persistent storage of blog posts, robust authentication to manage user access, comprehensive testing to ensure application stability, and a web-based interface for easy accessibility.

## ✨ Features

- 🗄️ Database
- 🔐 Auth
- 🧪 Testing
- 🕸️ Web


## 🛠️ Tech Stack

- ⚛️ React


## 📦 Key Dependencies

```
@ckeditor/ckeditor5-build-classic: ^44.0.0
@ckeditor/ckeditor5-react: ^9.4.0
@testing-library/jest-dom: ^5.17.0
@testing-library/react: ^13.4.0
@testing-library/user-event: ^13.5.0
@tinymce/tinymce-react: ^5.1.1
axios: ^1.7.9
draft-js: ^0.11.7
javascript-time-ago: ^2.5.11
react: ^18.3.1
react-dom: ^18.3.1
react-icons: ^5.3.0
react-quill: ^2.0.0
react-router-dom: ^6.27.0
react-scripts: 5.0.1
```

## 🚀 Run Commands

- **start**: `npm run start`
- **build**: `npm run build`
- **test**: `npm run test`
- **eject**: `npm run eject`
- **THIS_MAKEFILE_PATH**: `make THIS_MAKEFILE_PATH`
- **THIS_DIR**: `make THIS_DIR`
- **install**: `make install`
- **node_modules**: `make node_modules`
- **lint**: `make lint`
- **test-node**: `make test-node`
- **test-browser**: `make test-browser`
- **test**: `make test`
- **coveralls**: `make coveralls`


## 📁 Project Structure

```
.
├── client
│   ├── package.json
│   ├── public
│   │   └── index.html
│   └── src
│       ├── assets
│       │   ├── avatar1.jpg
│       │   ├── avatar2.jpg
│       │   ├── avatar3.jpg
│       │   ├── avatar4.jpg
│       │   ├── avatar5.jpg
│       │   ├── blog1.jpg
│       │   ├── blog2.jpg
│       │   ├── blog3.jpg
│       │   ├── loading.gif
│       │   ├── logo.png
│       │   └── thumbnail.jpg
│       ├── components
│       │   ├── CustomEditor.jsx
│       │   ├── Footer.jsx
│       │   ├── Header.jsx
│       │   ├── Layout.jsx
│       │   └── Loader.jsx
│       ├── context
│       │   └── userContext.jsx
│       ├── data.js
│       ├── index.css
│       ├── index.js
│       └── pages
│           ├── AuthorPosts.jsx
│           ├── Authors.jsx
│           ├── CategoryPosts.jsx
│           ├── CreatePost.jsx
│           ├── Dashboard.jsx
│           ├── DeletePost.jsx
│           ├── EditPost.jsx
│           ├── ErrorPage.jsx
│           ├── Home.jsx
│           ├── Login.jsx
│           ├── Logout.jsx
│           ├── PostAuthor.jsx
│           ├── PostDetails.jsx
│           ├── PostItem.jsx
│           ├── Posts.jsx
│           ├── Register.jsx
│           └── UserProfile.jsx
└── server
    ├── controllers
    │   ├── postController.js
    │   └── userController.js
    ├── index.js
    ├── middleware
    │   ├── authMiddleware.js
    │   └── errorMiddleware.js
    ├── models
    │   ├── errorModel.js
    │   ├── postModel.js
    │   └── userModel.js
    ├── package.json
    ├── routes
    │   ├── postRoutes.js
    │   └── userRoutes.js
    ├── uploads
    │   ├── abc-95085f63-a0f9-419d-a489-4a7c5c712f67.png
    │   ├── abc.03449a18-9b9b-4dc3-843a-eed0f7c00d21.png
    └── vercel.json
```

## 🛠️ Development Setup

### Node.js/JavaScript Setup
1. Install Node.js (v18+ recommended)
2. Install dependencies: `npm install` or `yarn install`
3. Start development server: (Check scripts in `package.json`, e.g., `npm run dev`)


## 👥 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/aqib1239/mern-blog-app.git`
3. **Create** a new branch: `git checkout -b feature/your-feature`
4. **Commit** your changes: `git commit -am 'Add some feature'`
5. **Push** to your branch: `git push origin feature/your-feature`
6. **Open** a pull request

Please ensure your code follows the project's style guidelines and includes tests where applicable.

---
*This README was generated with ❤️ by ReadmeBuddy*
