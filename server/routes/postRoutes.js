const {Router} = require('express');
const router = Router();
const {createPost, getAllPosts, getSinglePost, getPostsByCategory, getPostsByAuthor, editPost, deletePost} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, createPost);
router.get('/get-all', getAllPosts);
router.get('/post/:id', getSinglePost);
router.get('/categories/:category', getPostsByCategory);
router.get('/authors/:id', getPostsByAuthor);
router.patch('/:id', authMiddleware, editPost);
router.delete('/:id', authMiddleware, deletePost);

module.exports = router;