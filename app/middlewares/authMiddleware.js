const jwt                  = require("jsonwebtoken");
const config               = require("config");
var auth                   = require("basic-auth");
const Users                = require("../models/users");
const { sendResponse }         = require("../helpers/utalityFunctions");
const messages             = require("../messages/customMessages");

function authCheck(req, res, next) {
  const user = auth(req);
  const error = false;
  if (!user)
    return res.status(498).send(sendResponse(1018, messages[1018], false, error));
  var email = user.name;
  var token = user.pass;

  Users.findOne({ email: email }, (err, userInfo) => {
    if (err)
      return res.status(400).send(sendResponse(1006, messages[1006], false, err));
    if (!userInfo)
      return res.status(400).send(sendResponse(1005, messages[1005], false, err));
      if (userInfo.isLoggedIn ===  false)
      return res.send(sendResponse(1240, messages[1240], false, err));
    jwt.verify(token, config.secretKey, (err, response) => {
      if (err)
        return res.status(498).send(sendResponse(1006, messages[1006], false, err));
      req.loginUser = userInfo;
      if (response.email !== userInfo.email)
        return res.status(400).send(sendResponse(1007, messages[1007], false, err));
      if (response.email !== email)
        return res.status(400).send(sendResponse(1007, messages[1007], false, err));
      next();
    });
  });
}

module.exports = authCheck;
