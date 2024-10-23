const { body, query } = require("express-validator");

module.exports = function userValidator(api) {
  switch (api) {
    case "register":
      return [
        body("email", "email is Required")
          .exists()
          .isEmail()
          .withMessage("email should be in email format"),
        body("password", "password is Required")
          .exists()
          .isString()
          .withMessage("password should be string")
          .isLength({ min: 8 })
          .withMessage("password should 8 characters long")
          .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/)
          .withMessage(
            "Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character."
          )
      ];
    case "login":
      return [
        body("email", "email is Required")
          .exists()
          .isEmail()
          .withMessage("email should be in email format"),
        body("password", "password is Required")
          .exists()
          .withMessage("Password is Required"),
      ];
  }
};
