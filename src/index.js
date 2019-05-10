"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
require("reflect-metadata");
var app_1 = require("./app");
var http_server_1 = require("./server/http-server");
var typeorm_1 = require("typeorm");
var config_1 = require("./config");
var logger_1 = require("./logger");
var core_1 = require("./core");
(function () { return __awaiter(_this, void 0, void 0, function () {
    var routes, app, server, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, typeorm_1.createConnection(config_1.dbConfig)];
            case 1:
                _a.sent();
                logger_1.default.info("Running mode: " + config_1.default.mode);
                logger_1.default.info("Database " + config_1.dbConfig.database + " (" + config_1.dbConfig.host + ":" + config_1.dbConfig.port + ") connected.");
                routes = [
                    core_1.container.get(core_1.types.ROUTES.IIndexRoute),
                    core_1.container.get(core_1.types.ROUTES.IAuthRoute)
                ];
                app = new app_1.default(routes).getInstance();
                server = new http_server_1.default(app);
                server.onError(function (error) {
                    var port = config_1.default.ssl ? config_1.default.port_https : config_1.default.port_http;
                    switch (error.code) {
                        case 'EACCES':
                            logger_1.default.error("Port " + port + " requires elevated privileges");
                            process.exit(1);
                            break;
                        case 'EADDRINUSE':
                            logger_1.default.error("Port " + port + " is already in use");
                            process.exit(1);
                            break;
                        default:
                            throw error;
                    }
                });
                server.onListening(function () {
                    var port = config_1.default.ssl ? config_1.default.port_https : config_1.default.port_http;
                    var type = config_1.default.ssl ? 'HTTPS' : 'HTTP';
                    logger_1.default.info(type + " server  listening on port " + port);
                    if (config_1.default.ssl) {
                        logger_1.default.info("Redirect HTTP server listening on port " + config_1.default.port_http_default);
                    }
                });
                server.start({
                    http: config_1.default.port_http,
                    https: config_1.default.port_https
                });
                return [3 /*break*/, 3];
            case 2:
                e_1 = _a.sent();
                logger_1.default.error(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
