const express = require("express");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const hbs = require("hbs");
const conf = require("./lib/config/config");
const log = require("./lib/logger").createLogger(module);
const mongoose = require('mongoose');
const startRouter = require("./routes/startRouter");
const autorizationController = require("./controllers/autorizationController")
const authorizationRouter = require("./routes/authorizationRouter");
const friendsRouter = require("./routes/friendsRouter");
const { createServer } = require("http");
const { Server } = require("socket.io");
const ioHandler = require("./ioHandler");
const app = express();

const urlencodedParser = express.urlencoded({extended: false});
const jsonParser = express.json();

//Шаблонизатор
app.set("view engine", "hbs"); // установка шаблонизатора
app.set("views", "templates"); // установка пути к представлениям
app.set("view options", {layout: "layouts/layout"}); // устанавливаем настройки для файлов layout
hbs.registerPartials(__dirname + "/templates/partials");

const sessionMiddleware =  session({
    secret: conf.get("session:secret"),
    key: conf.get("session:key"),
    cookie: conf.get("session:cookie"),
    resave: conf.get("session:resave"),
    saveUninitialized: conf.get("session:saveUninitialized"),
    store: mongoStore.create({mongoUrl: conf.get("mongoUrl")})
  });

app.use(sessionMiddleware);
app.use("/", startRouter);
app.use(express.static(__dirname + "/public"));
app.use(urlencodedParser, jsonParser);
app.use("/authorization", authorizationRouter);
app.use(autorizationController.authenticationMiddleware());
app.get("/chat", function(req, res) {
    res.render("chat");
});
app.use(express.static(__dirname + "/private"));
app.use("/friends", friendsRouter);
app.use((req, res) => {
    res.status("404").send("Страница не найдена");
});

const start = async function() {
    try{
        await mongoose.connect(conf.get("mongoUrl"));
        const httpServer = createServer(app);
        const io = new Server(httpServer, {
            cors: {
              origin: "http://localhost"
            }
        });

        io.use(function(socket, next) {
            sessionMiddleware(socket.request, socket.request.res, next);
        });

        const onConnection = (socket) => {
            ioHandler(io, socket);
        }

        io.on("connection", onConnection);
        
        httpServer.listen(conf.get("port"), () => {
            log.info(`Сервер запустился на порте ${conf.get("port")}`);
        });
    } catch(e) {
        log.error(e.message);
    }
}

start();