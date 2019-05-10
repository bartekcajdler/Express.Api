"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var https = require("https");
var fs = require("fs");
var config_1 = require("../config");
var http_status_1 = require("./http-status");
var HttpServer = /** @class */ (function () {
    function HttpServer(app) {
        if (config_1.default.ssl) {
            var options = {
                key: fs.readFileSync(__dirname + "/" + config_1.default.ssl_key),
                cert: fs.readFileSync(__dirname + "/" + config_1.default.ssl_cert),
            };
            var redirectApp = function (req, res) {
                res.writeHead(http_status_1.HttpStatus.MOVED_PERMANENTLY, {
                    "Location": "https://" + req.headers['host'] + req.url
                });
                res.end();
            };
            this.mainHttpServer = https.createServer(options, app);
            this.redirectHttpServer = http.createServer(redirectApp);
        }
        else {
            this.mainHttpServer = http.createServer(app);
        }
    }
    HttpServer.prototype.start = function (ports) {
        if (config_1.default.ssl) {
            this.mainHttpServer.listen(ports.https);
            this.redirectHttpServer.listen(ports.http);
        }
        else {
            this.mainHttpServer.listen(ports.http);
        }
    };
    HttpServer.prototype.onError = function (onError) {
        this.mainHttpServer.on('error', onError);
    };
    HttpServer.prototype.onListening = function (onListening) {
        this.mainHttpServer.on('listening', onListening);
    };
    return HttpServer;
}());
exports.default = HttpServer;
