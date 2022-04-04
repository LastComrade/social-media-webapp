const router = require("express").Router();
const postCont = require("../controllers/posts");
const authMid = require("../middlewares/auth");

// Create a post
router.route("/").post(authMid.isAuthenticated, postCont.create);

// Get timeline posts
router.route("/timeline").get(authMid.isAuthenticated, postCont.timelinePosts);

// Get user's posts
router
  .route("/profile/:username")
  .get(authMid.isAuthenticated, postCont.usersPosts);

// Update a post
router.route("/:id").put(authMid.isAuthenticated, postCont.update);

// Delete a post
router.route("/:id").delete(authMid.isAuthenticated, postCont.delete);

// Get a post
router.route("/:id").get(authMid.isAuthenticated, postCont.getPost);

// Like / Dislike a post
router.route("/:id/like").put(authMid.isAuthenticated, postCont.likeOrDislike);

module.exports = router;
