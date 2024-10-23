const fs                            = require("fs");
var util                            = require("util");
const path                          = require("path");
const config                        = require("config");
const bcrypt                        = require("bcrypt");
const Users                         = require("../models/users");
const { validationResult, body }    = require("express-validator");
const messages                      = require("../messages/customMessages");
const sendEmail                     = require("../helpers/sendEmail");

const { sendResponse ,getToken, getEmailTemplate}              = require("../helpers/utalityFunctions");

// SAMPLE TO REGISTER
async function registerUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(sendResponse(1003, messages[1003], false, errors.errors));
  }

  delete req.body.active;
  delete req.body.role;

  var token = getToken(req.body.email);
  var link = util.format(config.link, token);
  

  var user = new Users({
    name: req.body.fullName,
    email: req.body.email,
    role: 3,
    phone: req.body.phone,
    countryCode: req.body.countryCode,
    token: token,
    password: req.body.password,
  });
  
  user.save(async (err, result) => {
    if (err) {
      if (err.code === 11000 && err.keyPattern.email == 1)
        return res.status(400).send(sendResponse(1010, messages[1010], false, err.keyPattern.email));
      if (err.code === 11000 && err.keyPattern.phone == 1)
        return res.status(400).send(sendResponse(1011, messages[1011], false, err.keyPattern.phone));
      else
        return res.status(400).send(sendResponse(1008, messages[1008], false, err));
    } else {
      var data = result;
      data.subject = config.registerSuccess;
      data.link = link;
    
      data.html = await getEmailTemplate( data.toObject(), "register.hbs", false, false);
      sendEmail(data.email , config.from, data.html , data, "", data.subject, "");

      return res.status(200).send(sendResponse(1009, messages[1009], true, result));
    }
  });
}


//SAMPLE LOGIN API
function login(req, res) {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send(sendResponse(1003, messages[1003], false, errors.errors));
  }

  let query = {};
  query.active = true; //to be changed to true
  query.email = req.body.email;
  
  Users.findOne(query, async (err, user) => {
    if (err) return res.status(400).send(sendResponse(1008, messages[1008], false, err));
    if (!user) return res.status(400).send(sendResponse(1005, messages[1005], false, err));
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) return res.status(400).send(sendResponse(1012, messages[1012], false, match));
    if (match) {
      let token = getLoginToken(req.body.email);
      let email = user.email;
      let loginCount = user.loginCount
      let data = { token, email, loginCount };
      return res.status(200).send(sendResponse(1013, messages[1013], true, data));
    }
  });
}

function getUser(req, res){
  return res.status(200).send(sendResponse(1013, messages[1013], true, true));
}


module.exports = { login,registerUser, getUser };
