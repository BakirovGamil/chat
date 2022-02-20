const express = require("express");
const chatController = require("../controllers/chatController");

const chatRouter = express.Router();

chatRouter.get("/chat", chatController.loadProfile);