const User = require("../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const {
  generateTokens,
  generateActivationToken,
  sendMailToActivateAccount,
  generateResetToken,
  sendMailToResetPassword,
  hashPassword,
} = require("../utility/auth");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth = {
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const foundUser = await User.find({
        $or: [{ username: username }, { email: email }],
      });
      if (foundUser.length > 1) {
        return res.status(403).json({
          message: "User already exists",
        });
      } else if (foundUser.length === 1 && !foundUser[0].isActive) {
        const activateToken = generateActivationToken(email);
        foundUser[0].activateToken = activateToken;
        foundUser[0].username = username;
        foundUser[0].email = email;
        foundUser[0].password = password;
        foundUser[0].save();
        try {
          sendMailToActivateAccount(email, activateToken);
        } catch (error) {
          console.log("Error caught - ", error);
          return res.status(500).json({
            message: "Failed to send activation link. Please try later.",
          });
        }
        return res
          .status(200)
          .json({ message: "Activation link sent successfully" });
      } else if (foundUser.length === 0) {
        const activateToken = generateActivationToken(email);
        const newUser = await new User({
          username,
          email,
          password,
          activateToken,
        });
        await newUser.save();
        try {
          sendMailToActivateAccount(email, activateToken);
        } catch (error) {
          console.log("Error caught - ", error);
          return res.status(500).json({
            message: "Failed to send activation link. Please try later.",
          });
        }
        return res
          .status(200)
          .json({ message: "Activation link sent successfully" });
      } else {
        return res.status(403).json({ message: "User already exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occurred" });
    }
  },

  activateUser: async (req, res) => {
    try {
      const token = req.body.token;
      console.log("Activate Token - ", token);
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.ACCOUNT_ACTIVATION_SECRET);
      } catch (err) {
        return res.status(400).json({ message: "Invalid reset link" });
      }
      const user = await User.findOne({ email: decoded.email });
      if (!user.isActive) {
        await User.updateOne(
          { email: decoded.email, activateToken: token },
          { $set: { isActive: true, activateToken: "" } }
        );
        return res
          .status(200)
          .json({ message: "Account activated successfully" });
      } else {
        return res.status(403).json({ message: "Account already activated" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "This one? An error occurred" });
    }
  },

  login: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
        isActive: true,
      });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      } else if (!user.isActive) {
        return res
          .status(403)
          .json({ message: "Please activate your account" });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword && user.isActive) {
        return res.status(400).json({ message: "Invalid password" });
      } else if (validPassword) {
        const { accessToken, refreshToken } = generateTokens(user.id);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 150,
        });
        res.status(200).json({ user, accessToken });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  googleLogin: async (req, res) => {
    try {
      const { id_token } = req.body;
      console.log("ID TOKEN - ", id_token);
      const response = await client.verifyIdToken({
        idToken: id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const { email_verified, email, name } = response.payload;
      if (email_verified) {
        const user = await User.findOne({ email });
        if (!user) {
          const newUser = await new User({
            email: email,
            username: email.substring(0, email.lastIndexOf("@")),
            password: email + id_token.substring(0, 15),
            isActive: true,
          });
          const savedUser = await newUser.save();
          const { accessToken, refreshToken } = generateTokens(savedUser.id);
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 150,
          });
          return res.status(200).json({ savedUser, accessToken });
        } else {
          const { accessToken, refreshToken } = generateTokens(user.id);
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 150,
          });
          user.isActive = true;
          return res.status(200).json({ user, accessToken });
        }
      } else {
        return res.status(400).json({ message: "Email is not verified" });
      }
      console.log(res.payload);
    } catch (err) {
      console.log("Google Login Error - ", err);
      return res.status(500).json({ message: "An error occurred" });
    }
  },

  facebookLogin: async (req, res) => {
    try {
      const { accessToken, userID } = req.body;
      const response = await axios.get(
        `https://graph.facebook.com/v12.0/${userID}/?fields=id,name,email&access_token=${accessToken}`
      );
      console.log(response.data);
      const { email } = response.data;
      const user = await User.findOne({ email });
      if (!user) {
        const newUser = await new User({
          email: email,
          username: email.substring(0, email.lastIndexOf("@")),
          password: email + userID + "FACEBOOKLOGIN",
          isActive: true,
        });
        const savedUser = await newUser.save();
        const { accessToken, refreshToken } = generateTokens(savedUser.id);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 150,
        });
        return res.status(200).json({ savedUser, accessToken });
      } else {
        await User.updateOne({ email }, { isActive: true });
        const { accessToken, refreshToken } = generateTokens(user.id);
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 150,
        });
        !user.isActive ? (user.isActive = true) : null;
        return res.status(200).json({ user, accessToken });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "An error occurred" });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      return res.status(200).json("Logout success");
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },

  sendPasswordResetLink: async (req, res) => {
    try {
      const username = req.body?.username;
      const email = req.body?.email;
      const user = username
        ? await User.findOne({ username })
        : await User.findOne({ email });
      console.log(user);
      if (!user || !user.isActive) {
        return res.status(400).json({ message: "User not found" });
      } else {
        const resetToken = generateResetToken(user.email);
        await User.updateOne({ email: user.email }, { resetToken: resetToken });
        try {
          sendMailToResetPassword(user.email, resetToken);
        } catch (error) {
          console.log("Error caught - ", error);
          return res.status(500).json({
            message: "Failed to send activation link. Please try later.",
          });
        }
        return res.status(200).json({ message: "Password reset link sent" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { newPassword, token: resetToken } = req.body;
      let decoded;
      try {
        decoded = jwt.verify(resetToken, process.env.PASSWORD_RESET_SECRET);
      } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid token" });
      }
      console.log(decoded.email);
      const hashedPassword = await hashPassword(newPassword);
      const user = await User.updateOne(
        {
          email: decoded.email,
          resetToken,
          isActive: true,
        },
        { password: hashedPassword, resetToken: "" }
      );
      console.log(user);
      if (user.matchedCount > 0) {
        return res.status(200).json({ message: "Password reset successfully" });
      } else {
        return res.status(400).json({ message: "Invalid reset link" });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  },

  refreshAccessToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { accessToken } = generateTokens(req.userId);
      const user = await User.findById(req.userId);
      const { password, createdAt, updatedAt, __v, ...userData } = user._doc;
      return res.status(200).json({ accessToken, user: userData });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};

module.exports = auth;
