const express = require("express");
const autorizationController = require("../controllers/autorizationController");
const { body } = require("express-validator"); 

const authorizationRouter = express.Router();
 
authorizationRouter.use(body('login').isLength({min: 4}), body('password').isLength({min: 4}));
authorizationRouter.post("/login", autorizationController.login);
authorizationRouter.post("/registration", autorizationController.registration);
authorizationRouter.get("/logout", autorizationController.logout);
 
module.exports = authorizationRouter;