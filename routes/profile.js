const express = require("express");
const router = express.Router();
const User = require("../models/user");
const verifyToken = require("../middleware/verifyJWT");

router.get("/allProfiles", verifyToken, (req, res) => {
  if (req && req.options) {
    let filter = {};
    if (req.options.role != "admin") {
      filter = { isPublic: true, role: "normal" };
    }

    User.find(filter, { password: 0, __v: 0 })
      .then((result) => {
        if (result.length === 0) {
          res.status(200).json({ message: "No profiles found" });
        } else {
          res.status(200).send(result);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
});

router.get("/", verifyToken, (req, res) => {
  let filter = { email: req.options.email };

  User.findOne(filter, { password: 0, __v: 0 })
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

router.put("/", verifyToken, (req, res) => {
  let filter = { email: req.options.email };
  let payload = req.body;

  User.findOneAndUpdate(filter, payload)
    .then((result) => {
      res.status(200).json({ message: "Data Updated Successfully" });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

module.exports = router;
