const express = require('express');
const {connect} = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
// const upload = require('express-fileupload');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const fileUpload = require('express-fileupload');


const app = express();
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
app.use(cors({ credentials: true, origin: 'https://mern-blog-app-olive.vercel.app', methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }));
app.use(fileUpload({useTempFiles: true, // Save files temporarily
    tempFileDir: "/tmp/"}));
// app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI).then(app.listen(process.env.PORT, () => console.log(`Server is Running at port ${process.env.PORT}`))).catch((err) => console.log(err));
