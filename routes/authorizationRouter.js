const express = require("express");
const autorizationController = require("../controllers/autorizationController");
const authorizationRouter = express.Router();
 
authorizationRouter.post("/login", autorizationController.login);
authorizationRouter.post("/registration", autorizationController.registration);
 
module.exports = authorizationRouter;