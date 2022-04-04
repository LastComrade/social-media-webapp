const User = require("../models/user");
const Post = require("../models/post");

const post = {
  create: async (req, res) => {
    const newPost = new Post(req.body);
    try {
      const savedPost = await newPost.save();
      return res.status(200).json(savedPost);
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  update: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.body.userId) {
        await post.updateOne({ $set: req.body });
        return res.status(200).json("The post has been updated");
      } else {
        return res.status(401).json("You can only update your own post");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  delete: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.userId === req.userId) {
        await post.deleteOne();
        return res.status(200).json("The post has been deleted");
      } else {
        return res.status(401).json("You can only delete your own post");
      }
    } catch (err) {
      return res.status(500).json(err);
    }
  },

  likeOrDislike: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post.likes.includes(req.userId)) {
        await post.updateOne({ $push: { likes: req.userId } });
        return res.status(200).json("The post has been liked");
      } else {
        await post.updateOne({ $pull: { likes: req.userId } });
        return res.status(200).json("Like removed from the post");
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      return res.status(200).json(post);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  timelinePosts: async (req, res) => {
    try {
      const currentUser = await User.findById(req.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.following.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      const posts = userPosts.concat(...friendPosts);
      return res.status(200).json(posts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },

  usersPosts: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.params.username });
      const userPosts = await Post.find({ userId: user._id });
      return res.status(200).json(userPosts);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
};

module.exports = post;
