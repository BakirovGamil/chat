const express = require("express");
const friendsController = require("../controllers/friendsController");

const friendsRouter = express.Router();

friendsRouter.get("/", friendsController.uploadFriends);
friendsRouter.post("/find", friendsController.findFriend);

module.exports = friendsRouter;