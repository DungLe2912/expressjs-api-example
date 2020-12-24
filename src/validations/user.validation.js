const customJoi = require('../utils/customJoi');

module.exports = {
  signUpValidation: {
    body: customJoi.object({
      email: customJoi.string().email().required(),
      password: customJoi.string().password().required(),
      confirmPassword: customJoi.string()
        .required()
        .confirmPassword(customJoi.ref('password')),
      role: customJoi.string().role().required(),
      fullName: customJoi.string().required().fullName(),
      birthday: customJoi.string().required().birthday(),
    }),
  },

  signInValidation: {
    body: customJoi.object({
      email: customJoi.string().email().required(),
      password: customJoi.string().password().required(),
    }),
  },
};
