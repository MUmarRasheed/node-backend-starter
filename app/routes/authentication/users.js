const express           = require("express");
const loginRouter       = express.Router();
const router            = express.Router();

/*  IMPORT Validators */
const userValidator                       = require("../../validators/users");


/*  IMPORT CONTROLLERS */
const Users                               = require("../../controllers/users");


//OPEN ROUTES
router.post("/login", userValidator("login"), Users.login);


/*AUTH ROUTES */
loginRouter.get("/getUser", Users.getUser);


module.exports = { loginRouter , router };
