const express = require("express");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const hbs = require("hbs");
const conf = require("./lib/config/config");
const log = require("./lib/logger").createLogger(module);
const mongoose = require('mongoose');
const autorizationController = require("./controllers/autorizationController");
const authorizationRouter = require("./routes/authorizationRouter");
const chatRouter = require("./routes/chatRouter");
const app = express();

const urlencodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();

//Шаблонизатор
app.set("view engine", "hbs"); // установка шаблонизатора
app.set("views", "templates"); // установка пути к представлениям
app.set("view options", {layout: "layouts/layout"}); // устанавливаем настройки для файлов layout
hbs.registerPartials(__dirname + "/templates/partials");

app.use(
    session({
      secret: conf.get("session:secret"),
      key: conf.get("session:key"),
      cookie: conf.get("session:cookie"),
      resave: conf.get("session:resave"),
      saveUninitialized: conf.get("session:saveUninitialized"),
      store: mongoStore.create({mongoUrl: conf.get("mongoUrl")})
    })
);
app.use(express.static(__dirname + "/public"));
app.use(urlencodedParser, jsonParser);
app.use("/authorization", authorizationRouter);
app.use("/chat", autorizationController.authenticationMiddleware(), authorizationRouter);

const start = async function() {
    try{
        await mongoose.connect(conf.get("mongoUrl"));
        app.listen(conf.get("port"), () => {
            log.info(`Сервер запустился на порте ${conf.get("port")}`);
        });
    } catch(e) {
        log.error(e.message);
    }
}

start();