const log = require("../lib/logger").createLogger(module);
const User = require("../scheme/user");
const crypto = require("crypto");
const conf = require("../lib/config/config");
const {validationResult} =  require("express-validator");
const res = require("express/lib/response");

exports.registration = async function (request, response, next) {
    try{
        log.info(`Поступил запрос на регистрацию ${request.body.login} ${request.body.password}`);
        const errors = validationResult(request); 
        if(!errors.isEmpty()) return response.status(400).json({message: "Логин или пароль содержит менее 4 символов"})

        const {login, password} = request.body;
        const candidate = await User.findOne({login});
        if(candidate) {
            return response.status(400).json({message: "Такой пользователь уже существует"});
        }

        const hashPassword = crypto.createHmac('sha256', conf.get("secret:key")).update(password).digest('hex');
        const newUser = new User({login, password: hashPassword});
        await newUser.save();
        response.status(200).json({message: "Пользователь зарегестрирован"});
    } catch(e) {
        log.error(e.message);
        response.sendStatus(500);
    }
    
};

exports.login = async function (request, response, next) {
    try{
        log.info("Поступил запрос на авторизацию");
        const errors = validationResult(request); 
        if(!errors.isEmpty()) return response.status(400).json({message: "Логин или пароль содержит менее 4 символов"})

        const {login, password} = request.body;
        const hashPassword = crypto.createHmac('sha256', conf.get("secret:key")).update(password).digest('hex');
        const candidate = await User.findOne({login, password: hashPassword});
        if(!candidate) return response.status(400).json({message: "Неверный логин или пароль"});
        request.session.isAuth = true;
        response.status(200).json({message: "Авторизация прошла успешно"});
        log.info("Авторизация прошла успешно");
    } catch(e) {
        log.error(e.message);
        response.sendStatus(500);
    }
};

exports.authenticationMiddleware = function authenticationMiddleware () {
    return function (req, res, next) {
        log.info(req.session.isAuth);
        if (req.session.isAuth) {
            return next()
        }

        res.redirect('/')
    }
}