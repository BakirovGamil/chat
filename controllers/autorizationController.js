const log = require("../lib/logger").createLogger(module);
const User = require("../scheme/user");
const crypto = require("crypto");
const conf = require("../lib/config/config");

exports.registration = async function (request, response) {
    try{
        log.info(`Поступил запрос на регистрацию ${request.body.login} ${request.body.password}`);
        const {login, password} = request.body;
        const candidate = await User.findOne({login});
        if(candidate) {
            return response.status(400).json({message: "Такой пользователь уже существует"});
        }

        const hashPassword = crypto.createHmac('sha256', conf.get("secret:key")).update(password).digest('hex');
        log.info(hashPassword);
        const newUser = new User({login, password: hashPassword});
        await newUser.save();
        response.status(200).json({message: "Пользователь зарегестрирован"});
        response.redirect
    } catch(e) {
        log.error(e.message);
        response.sendStatus(500);
    }
    
};

exports.login = async function (request, response) {
    try{
        log.info("Поступил запрос на авторизацию");
        const {login, password} = request.body;
        const hashPassword = crypto.createHmac('sha256', conf.get("secret:key")).update(password).digest('hex');
        const candidate = await User.findOne({login, password: hashPassword});
        if(!candidate) return response.sendStatus(400);
        response.status(200).json({message: "Авторизация прошла успешно"});
    } catch(e) {
        log.error(e.message);
        response.sendStatus(500);
    }
};