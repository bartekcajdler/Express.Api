"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var http_status_1 = require("./server/http-status");
var config_1 = require("./config");
var swaggerJsdoc = require("swagger-jsdoc");
var swaggerUi = require("swagger-ui-express");
var Guid = require("uuid/v1");
var App = /** @class */ (function () {
    function App(routes) {
        this.apiUrl = "/" + config_1.default.api_url + "/" + config_1.default.api_version_url;
        this.docUrl = "/" + config_1.default.doc_url;
        this.express = express();
        this.security();
        this.port();
        this.middleware();
        this.routes(routes);
    }
    App.prototype.getInstance = function () {
        return this.express;
    };
    App.prototype.port = function () {
        this.express.set('port', config_1.default.port_http);
    };
    App.prototype.security = function () {
        this.express.use(helmet());
        this.express.disable('x-powered-by');
    };
    App.prototype.middleware = function () {
        if (config_1.default.express_logs) {
            this.express.use(logger('dev'));
        }
        this.express.use(bodyParser.json({ limit: '10mb' }));
        this.express.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    };
    App.prototype.routes = function (routes) {
        this.express.all('*', function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
            next();
        });
        this.express.use(function (req, res, next) {
            req['id'] = Guid();
            next();
        });
        this.customRoutes(routes);
        this.express.use(function (req, res) {
            res.status(http_status_1.HttpStatus.NOT_FOUND).json({
                status: http_status_1.HttpStatus.NOT_FOUND,
                error: 'Not found.'
            });
        });
        this.express.use(function (err, req, res) {
            res.status(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: http_status_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Internal server error.'
            });
        });
    };
    App.prototype.customRoutes = function (routes) {
        var _this = this;
        routes.forEach(function (route) {
            _this.express.use(_this.apiUrl, route.getRouter());
        });
        if (config_1.default.swagger) {
            var swagger = this.getSwaggerSpecs();
            this.express.use(this.docUrl, swaggerUi.serve, swaggerUi.setup(swagger));
        }
    };
    App.prototype.getSwaggerSpecs = function () {
        var url = '';
        if (config_1.default.mode === 'development') {
            url = './src/core/routes/**/*.yaml';
        }
        else {
            url = './core/routes/**/*.yaml';
        }
        var options = {
            swaggerDefinition: {
                info: {
                    title: "Api " + config_1.default.api_version_url,
                    version: '1.0.0',
                    description: 'Swagger for API',
                },
                basePath: this.apiUrl,
                securityDefinitions: {
                    jwt: {
                        type: 'apiKey',
                        name: 'token',
                        in: 'header'
                    }
                },
                security: [
                    { jwt: [] }
                ]
            },
            apis: [url],
            securityDefinitions: {
                auth: {
                    type: 'basic'
                }
            },
        };
        return swaggerJsdoc(options);
    };
    return App;
}());
exports.default = App;
