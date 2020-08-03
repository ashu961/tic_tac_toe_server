const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  googleID: String,
  userDetails: {}
});

mongoose.model("users", userSchema);