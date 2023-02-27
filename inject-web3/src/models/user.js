const mongoose = require("mongoose");

// Define schema and model
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  userHash: {
    type: String,
    unique: true,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  mnemonic: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
