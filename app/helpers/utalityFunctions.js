const config                = require("config");
const mongoosePaginate      = require("mongoose-paginate-v2");
const Handlebars            = require("handlebars");
var jwt                     = require("jsonwebtoken");

/*
 - This File Contains all the utality function 
 - Write Reusable function in this file 
*/


// RESPONSE HELPER
function sendResponse(messageCode, message, success, data) {
    let response = {
      messageCode: messageCode,
      message: message,
      success: success,
      data: data,
    };
    return response;
}

// PAGINATION HELPER 
mongoosePaginate.paginate.options = {
    lean: true,
    limit: config.pageSize,
};
var paginate = mongoosePaginate;

// GET TOKEN HELPER (You can change it according to generate expire token or non expire )
function getToken(email) {
  var token = jwt.sign({ email: email }, config.secretKey);
  return token;
}

// GET Email Template HELPER 
async function getEmailTemplate(data, templateName, link, token) {
  var options = {
    name: data.name,
    token: token,
    link: link,
    data: data,
    company: config.company,
    companyLogo: config.companyLogo,
  };
  var source = fs.readFileSync(path.resolve(__dirname, "../views/" + templateName)).toString("utf8");
  var template = Handlebars.compile(source);
  var result = template(options);
  return result;
}
  
module.exports = { sendResponse , paginate, getToken, getEmailTemplate };
  