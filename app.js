const express = require("express");
const session = require('express-session');
const hbs = require("hbs");
const conf = require("./lib/config/config");
const log = require("./lib/logger").createLogger(module);
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const authorizationRouter = require("./routes/authorizationRouter");
const { body, validationResult } = require("express-validator"); 

const app = express();

const urlencodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();

//Шаблонизатор
app.set("view engine", "hbs"); // установка шаблонизатора
app.set("views", "templates"); // установка пути к представлениям
app.set("view options", {layout: "layouts/layout"}); // устанавливаем настройки для файлов layout
hbs.registerPartials(__dirname + "/templates/partials");

app.use(express.static(__dirname + "/public"));
app.use("/authorization", jsonParser, authorizationRouter);

const start = async function() {
    try{
        await mongoose.connect("mongodb://localhost:27017/chat");
        app.listen(conf.get("port"), () => {
            log.info(`Сервер запустился на порте ${conf.get("port")}`);
        });
    } catch(e) {
        log.error(e.message);
    }
}

start();