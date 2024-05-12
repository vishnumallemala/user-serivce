const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const helper = require("./helper/helper");
require("dotenv").config();

const User = require("./models/user");
const swaggerDocument = require("./swagger.json");
const profileRoutes = require("./routes/profile");

const app = express();

app.use(express.json());
app.use("/profile", profileRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Configure Google OAuth strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // Use profile information to create or retrieve user in your database
      // Generate JWT token
      helper
        .registerHelper(profile)
        .then((result) => {
          const token = jwt.sign(
            {
              userId: result.id,
              email: profile.emails[0].value,
              role: result.role,
            },
            process.env.SECRET,
            {
              expiresIn: "1h",
            }
          );
          return done(null, {
            user: {
              id: result.id,
              email: result.email,
            },
            accessToken: token,
          });
        })
        .catch((err) => {
          return done(err);
        });
    }
  )
);

// Google Authentication route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Redirect or respond with JWT token
    res.send(req.user);
  }
);

// Registration Route
app.post("/register", (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    bio: req.body.bio,
    password: bcrypt.hashSync(req.body.password, 8),
    isPublic: req.body.isPublic,
    role: "normal",
  });

  User.findOne({
    email: req.body.email,
  }).then((userDetails) => {
    if (!userDetails) {
      user
        .save()
        .then((data) => {
          return res
            .status(200)
            .json({ message: "User registered successfully" });
        })
        .catch((err) => {
          return res.status(500).json({ error: err });
        });
    } else {
      return res.status(200).json({ message: "User already exists" });
    }
  });
});

// Login Route
app.post("/login", (req, res) => {
  let emailPassed = req.body.email;
  let passwordPassed = req.body.password;
  User.findOne({
    email: emailPassed,
  })
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      var isPasswordValid = bcrypt.compareSync(passwordPassed, user.password);
      if (!isPasswordValid) {
        return res.status(401).send({
          message: "Invalid Password",
        });
      } else {
        var token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            role: user.role,
          },
          process.env.SECRET,
          {
            expiresIn: "1h",
          }
        );
        return res.status(200).send({
          user: {
            id: user.id,
            email: user.email,
          },
          accessToken: token,
        });
      }
    })
    .catch((err) => {});
});

// Establishing connection to mongoDB
try {
  const DB_NAME = process.env.DB_NAME || "userReport";
  const DB_HOST = process.env.DB_HOST || "localhost";
  const DB_PORT = process.env.DB_PORT || "27017";
  if (DB_HOST !== "localhost") {
    const DB_USER = process.env.DB_USER;
    const DB_PASS = process.env.DB_PASS;
    DB_URL =
      "mongodb+srv://" +
      DB_USER +
      ":" +
      DB_PASS +
      "@" +
      DB_HOST +
      "/" +
      DB_NAME;
  } else {
    DB_URL = "mongodb://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME;
  }
  mongoose.connect(DB_URL, { useNewUrlParser: true });
} catch (err) {
  console.log(err);
  console.log("Failed while connecting to mongodb");
}

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
