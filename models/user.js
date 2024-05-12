var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: [true, "name not provided "],
  },
  bio: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    unique: [true, "email already exists in database!"],
    lowercase: true,
    trim: true,
    required: [true, "email not provided"],
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email!",
    },
  },
  role: {
    type: String,
    enum: ["normal", "admin"],
  },
  accountLinked: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: function () {
      return !this.accountLinked;
    },
  },
  isPublic: {
    type: Boolean,
    default: false,
    required: false,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
