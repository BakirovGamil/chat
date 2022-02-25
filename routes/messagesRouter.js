const express = require("express");
const messageController = require("../controllers/messagesController");
const messagesRouter = express.Router();

messagesRouter.get("/", messageController.show)

module.exports = messagesRouter;