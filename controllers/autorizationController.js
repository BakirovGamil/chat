const log = require("../lib/logger").createLogger(module);
const User = require("../scheme/user");
const crypto = require("crypto");
const conf = require("../lib/config/config");
const {validationResult} =  require("express-validator");

exports.registration = async function (request, response, next) {
    try{
        log.info(`Поступил запрос на регистрацию`);
        const errors = validationResult(request);
        if(!errors.isEmpty()) return response.status(400).json({message: errors.errors[0].msg})

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
        if(!errors.isEmpty()) return response.status(400).json({message: errors.msg})

        const {login, password} = request.body;
        const hashPassword = crypto.createHmac('sha256', conf.get("secret:key")).update(password).digest('hex');
        const candidate = await User.findOne({login, password: hashPassword});
        if(!candidate) return response.status(400).json({message: "Неверный логин или пароль"});
        request.session.isAuth = true;
        request.session.login = login;
        response.status(200).json({message: "Авторизация прошла успешно", name: login});
        log.info("Авторизация прошла успешно");
    } catch(e) {
        log.error(e.message);
        response.sendStatus(500);
    }
};

exports.logout = async function(req, res) {
    try {
        log.info("Поступил запрос на выход");
        req.session.destroy();
        res.status(200).json({message: "Успешный выход из аккаунта"});
    } catch (e) {
        log.error(e.message);
        response.sendStatus(500);
    }
}

exports.authenticationMiddleware = function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.session.isAuth) {
            return next()
        }

        res.redirect('/')
    }
}