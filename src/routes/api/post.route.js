const express = require('express');
const postController = require('../../controllers/post.controller');
const {
  createPostValidation,
  getListPostValidation,
  deletePostValidation,
  getPostValidation,
  updatePostValidation,
} = require('../../validations/post.validation');

const router = express.Router();

// GET /api/posts
router.route('/')
  .get(getListPostValidation, postController.listPost);

// POST /api/posts
router.route('/')
  .post(createPostValidation, postController.createPost);

// GET /api/posts/:id
router.route('/:id')
  .get(getPostValidation, postController.showPost);

// DELETE /api/posts/:id
router.route('/:id')
  .delete(deletePostValidation, postController.deletePost);

// DELETE /api/posts/:id
router.route('/:id')
  .patch(updatePostValidation, createPostValidation,
    postController.updatePost);

module.exports = router;
