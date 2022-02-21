const express = require("express");
const startController = require("../controllers/startController");

const startRouter = express.Router();

startRouter.get("/", startController.toLogin);
startRouter.get("/index.html", startController.toLogin);
startRouter.get("/auth.html", startController.toLogin);
startRouter.get("/registration.html", startController.toRegistration);


module.exports = startRouter;