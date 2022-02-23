const express = require("express");
const autorizationController = require("../controllers/autorizationController");
const { body } = require("express-validator"); 

const authorizationRouter = express.Router();
 
authorizationRouter.use(
    body('login')
        .isLength({min: 4, max: 16})
        .withMessage("Логин и пароль должны содержать от 4 до 16 символов")
        .trim()
        .custom(value => !/\s/.test(value))
        .withMessage("Логин и пароль не должны содержать пробелов"),
    body('password')
        .isLength({min: 4, max: 16})
        .withMessage("Логин и пароль должны содержать от 4 до 16 символов")
        .trim()
        .custom(value => !/\s/.test(value))
        .withMessage("Логин и пароль не должны содержать пробелов"),
    );
authorizationRouter.post("/login", autorizationController.login);
authorizationRouter.post("/registration", autorizationController.registration);
authorizationRouter.get("/logout", autorizationController.logout);
 
module.exports = authorizationRouter;