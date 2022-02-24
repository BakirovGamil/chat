const mongoose = require('mongoose');

module.exports = function(io, socket) {
    socket.on("joinroom", (login) => {
        const arr = [login, socket.request.session.login].sort();
        socket.join(arr.join("%"));

        socket.on("data", data => {
            io.to(arr.join("%")).emit("message", data);
        });
    }); 
}