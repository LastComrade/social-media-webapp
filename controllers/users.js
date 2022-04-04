const User = require("../models/user");
const Post = require("../models/post");

const users = {
  update: async (req, res) => {
    if (req.userId === req.params.id || (req.user && req.user.isAdmin)) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          console.log(err);
          return res.status(500).json(err);
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        return res.status(200).json("Account has beeen updated!");
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    } else {
      return res
        .status(403)
        .json({ message: "You can update infromation of your account only" });
    }
  },

  delete: async (req, res) => {
    if (req.userId === req.params.id || (req.user && req.user.isAdmin)) {
      try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
          return res.status(200).json("Account has been deleted!");
        } else if (!user) {
          return res.status(404).json("User not found!");
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    } else {
      return res
        .status(403)
        .json({ message: "You can delete your account only" });
    }
  },

  getUser: async (req, res) => {
    try {
      const userId = req.query.userId;
      const username = req.query.username;
      let user;
      if (userId) {
        user = await User.findById(userId);
      } else if (username) {
        user = await User.findOne({ username });
      }
      if (user) {
        const { password, updatedAt, __v, createdAt, ...userInfo } = user._doc;
        return res.status(200).json(userInfo);
      } else if (!user) {
        return res.status(404).json("User not found!");
      }
    } catch (err) {
      console.log("This is that erorr", err);
      return res.status(500).json(err);
    }
  },

  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.userId);
      if (user) {
        const { password, updatedAt, ...userInfo } = user._doc;
        return res.status(200).json(userInfo);
      } else if (!user) {
        return res.status(404).json("User not found!");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  getFriends: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const friends = await Promise.all(
        user.following.map((friendId) => {
          return User.findById(friendId);
        })
      );
      let friendList = [];
      friends.map((friend) => {
        const { _id, username, profilePicture } = friend;
        friendList.push({ _id, username, profilePicture });
      });
      return res.status(200).json(friendList);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  follow: async (req, res) => {
    if (req.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.userId);
        if (
          !user.followers.includes(req.userId) &&
          !currentUser.following.includes(req.params.id)
        ) {
          await user.updateOne({ $push: { followers: req.userId } });
          await currentUser.updateOne({ $push: { following: req.params.id } });
          return res.status(200).json("You are now following this user!");
        } else {
          return res.status(400).json("You are already following this user!");
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json({ message: "You can't follow yourself" });
    }
  },

  unfollow: async (req, res) => {
    if (req.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.userId);
        if (
          user.followers.includes(req.userId) &&
          currentUser.following.includes(req.params.id)
        ) {
          await user.updateOne({ $pull: { followers: req.userId } });
          await currentUser.updateOne({ $pull: { following: req.params.id } });
          return res.status(200).json("User has been unfollowed!");
        } else {
          return res.status(400).json("You don't follow this user!");
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json(err);
      }
    } else {
      return res.status(403).json({ message: "You can't unfollow yourself" });
    }
  },
};

module.exports = users;
