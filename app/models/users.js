const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const { Schema } = mongoose;
const {paginate} = require("../helpers/utalityFunctions");


/*
  - Create index for only those fields which you want to query (For Searching)
  - [ role ]  // change according to your requirements
      1 = SuperAdmin
      2 = Admin
      3 = User
  - 
*/

//User Schema
const userSchema = new Schema({
  name: { type: String },
  email: { type: String, unique: true, index: true },
  phone: { type: String, unique: true, index: true },
  role: { type: Number },
  active: { type: Boolean, default: false },
  token: { type: String },
  password: { type: String },
 
});

//Save createdAt when a document created
userSchema.pre("save", async function (next) {
  this.createdAt = new Date().getTime();
  if (this.isModified("password")) {
    this.password = await bcrypt.hashSync(this.password, config.salt);
  }
  next();
});

userSchema.plugin(paginate);

const Users = mongoose.model("users", userSchema);

Users.createIndexes()

module.exports = Users;
