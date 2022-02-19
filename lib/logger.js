const { format } = require('express/lib/response');
let winston = require('winston');

function createLogger(module) {
    let path = module.filename.split("\\").slice(-2).join("\\");
    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.label({label: path}),
                    winston.format.colorize(),
                    winston.format.printf((info) => `[${info.label}] ${info.level}: ${info.message}`)
                )
            }),
            new winston.transports.File({
                format: winston.format.combine(
                    winston.format.label({label: path}),
                    winston.format.timestamp({format: "DD:MM:YY"}),
                    winston.format.printf((info) => `[${info.label}, ${info.timestamp}] ${info.level}: ${info.message}`)
                ),
                filename: 'errors.log',
                level: 'error',
              })
        ]
    });
}

exports.createLogger = createLogger;