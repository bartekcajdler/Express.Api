"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var winston_1 = require("winston");
var index_1 = require("../config/index");
var DailyRotateFile = require("winston-daily-rotate-file");
var combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, prettyPrint = winston_1.format.prettyPrint, printf = winston_1.format.printf, label = winston_1.format.label, colorize = winston_1.format.colorize;
var customFormat = printf(function (info) {
    return info.timestamp + " [" + info.label + "] " + info.level + ": " + (info.message ? info.message : JSON.stringify(info));
});
var consoleTransportOptionsFormat = combine(timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
}), label({ label: 'Express.Api' }), prettyPrint(), colorize(), customFormat);
var dailyRotateFileTransportOptionsFormat = combine(timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
}), label({ label: 'Express.Api' }), prettyPrint(), customFormat);
var consoleTransportOptions = {
    level: index_1.default.level,
    handleExceptions: true,
    silent: false,
    format: consoleTransportOptionsFormat
};
var dailyRotateFileTransportOptions = {
    json: false,
    filename: '%DATE%.log',
    level: index_1.default.level,
    datePattern: 'YYYY-MM-DD',
    dirname: 'logs',
    format: dailyRotateFileTransportOptionsFormat
};
var logger = winston_1.createLogger({
    transports: [
        new winston_1.transports.Console(consoleTransportOptions),
        new DailyRotateFile(dailyRotateFileTransportOptions)
    ]
});
exports.default = logger;
