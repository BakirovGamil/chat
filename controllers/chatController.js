const log = require("../lib/logger").createLogger(module);

exports.loadProfile = async function(req, res) {
    res.redirect("/chat.html");
};