const log = require("../lib/logger").createLogger(module);

exports.toLogin = function(req, res) {
    if(req.session.isAuth)
        res.redirect("chat.html");
    else {
        let path = __dirname.split("\\");
        path.pop();
        path = path.join("\\");
        res.status(200).sendFile(path + "\\public\\auth.html");
    }    
};

exports.toRegistration = function(req, res) {
    if(req.session.isAuth)
        res.redirect("chat.html");
    else { 
        let path = __dirname.split("\\");
        path.pop();
        path = path.join("\\");
        res.status(200).sendFile(path + "\\public\\registration.html");
    }  
};