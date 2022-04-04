const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      deafult: [],
    },
    following: {
      type: Array,
      deafult: [],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 50,
    },
    from: {
      type: String,
      max: 50,
    },
    relationship: {
      type: Number,
      enum: [0, 1, 2],
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    activateToken: {
      type: String,
      default: "",
    },
    resetToken: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = this.password.trim();
    const hashedPassword = await bcrypt.hash(this.password, salt);

    this.password = hashedPassword;
    this.username = this.username.trim();
    this.email = this.email.trim();
    next();
  } catch (err) {
    console.log(err);
  }
});

module.exports = mongoose.model("User", UserSchema);
