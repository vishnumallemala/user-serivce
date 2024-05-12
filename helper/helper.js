const User = require("../models/user");

module.exports.registerHelper = (profile) => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name: profile.displayName,
      email: profile.emails[0].value,
      accountLinked: true,
      role: "normal",
    });

    User.findOne({
      email: profile.emails[0].value,
    }).then((userDetails) => {
      if (!userDetails) {
        user
          .save()
          .then((data) => {
            resolve(data);
          })
          .catch((err) => {
            reject({ error: err });
          });
      } else {
        resolve(userDetails);
      }
    });
  });
};
