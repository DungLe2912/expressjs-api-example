const express = require('express');
const { validate } = require('express-validation');

const userController = require('../../controllers/user.controller');
const { authenticate, authorize } = require('../../middlewares/auth');
const {
  signInValidation,
  signUpValidation,
} = require('../../validations/user.validation');
const { role: systemRole } = require('../../constants/role');

const router = express.Router();

// POST /user/sign-up
router.route('/sign-up')
  .post(validate(signUpValidation), userController.signUp);

// POST /api/sign-in
router.route('/sign-in')
  .post(validate(signInValidation), userController.signIn);

// GET /api/profile
router.route('/profile')
  .get(
    authenticate(),
    authorize([
      systemRole.admin,
      systemRole.user,
    ]),
    userController.getInfo,
  );

module.exports = router;
