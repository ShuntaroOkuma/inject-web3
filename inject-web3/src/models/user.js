const mongoose = require("mongoose");

// Define schema and model
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userId: String,
  address: String,
  privateKey: String,
  publicKey: String,
  mnemonic: String,
});

module.exports = mongoose.model("User", UserSchema);
