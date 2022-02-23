const log = require("../lib/logger").createLogger(module);
const User = require("../scheme/user");

exports.uploadFriends = async function(req, res) {
    try {
        res.render("friends");
    } catch (e) {
        log.error(e.message);
        response.sendStatus(500);
    }
}

exports.findFriend = async function(req, res) {
    try {
        const {login} = req.body;
        const friend = await User.findOne({login});
        if(friend) 
            res.status(200).json({login})
        else
            res.status(400).json({message: "Пользователь не найден"});

    } catch (e) {
        log.error(e.message);
        res.sendStatus(500);
    }
}