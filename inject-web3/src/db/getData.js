const User = require("../models/user");

module.exports.getUser = async function (userHash) {
  // Get address from mongodb
  const result = await User.findOne({ userHash: userHash }, (err, result) => {
    if (err) {
      throw err;
    }
    if (!result) {
      return;
    } else {
      return result;
    }
  })
    .clone()
    .catch(function (err) {
      console.log(err);
    });

  return result;
};
