let fs    = require('fs');
let nconf = require('nconf');
let path = require("path");

nconf.file({ file: path.join(__dirname, "config.json") });

module.exports = nconf;