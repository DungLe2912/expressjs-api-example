const express = require('express');
const postController = require('../../controllers/post.controller');
const {
  createPostValidation,
  getListPostValidation,
  deletePostValidation,
  getPostValidation,
  updatePostValidation,
} = require('../../validations/post.validation');
const { authenticate, authorize } = require('../../middlewares/auth');
const { role: systemRole } = require('../../constants/role');

const router = express.Router();

// GET /api/posts
router.route('/')
  .get(
    getListPostValidation,
    authenticate(),
    authorize([
      systemRole.admin,
      systemRole.user,
    ]),
    postController.listPost,
  );

// POST /api/posts
router.route('/')
  .post(
    createPostValidation,
    authenticate(),
    authorize([
      systemRole.admin,
      systemRole.user,
    ]),
    postController.createPost,
  );

// GET /api/posts/:id
router.route('/:id')
  .get(
    getPostValidation,
    authenticate(),
    authorize([
      systemRole.admin,
      systemRole.user,
    ]),
    postController.showPost,
  );

// DELETE /api/posts/:id
router.route('/:id')
  .delete(
    deletePostValidation,
    authenticate(),
    authorize([
      systemRole.admin,
      systemRole.user,
    ]),
    postController.deletePost,
  );

// DELETE /api/posts/:id
router.route('/:id')
  .patch(
    updatePostValidation,
    createPostValidation,
    authenticate(),
    authorize([
      systemRole.admin,
      systemRole.user,
    ]),
    postController.updatePost,
  );

module.exports = router;
