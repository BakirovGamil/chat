const log = require("../lib/logger").createLogger(module);

exports.show = function(req, res, next) {
    const who = req.query["who"];
    if(!who) next();

    res.render("messages", {
        who
    });
}