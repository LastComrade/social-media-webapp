const router = require("express").Router();
const userCont = require("../controllers/users");
const authMid = require("../middlewares/auth");

// Get a user
router.route("/").get(authMid.isAuthenticated, userCont.getUser);

// Update user information
router.route("/:id").put(authMid.isAuthenticated, userCont.update);

// Delete
router.route("/:id").delete(authMid.isAuthenticated, userCont.delete);

// Follow a user
router.route("/:id/follow").put(authMid.isAuthenticated, userCont.follow);

// Unfollow a user
router.route("/:id/unfollow").put(authMid.isAuthenticated, userCont.unfollow);

// Get all friends of a user
router
  .route("/friends/:username")
  .get(authMid.isAuthenticated, userCont.getFriends);

module.exports = router;
