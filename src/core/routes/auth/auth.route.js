"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var http_status_1 = require("../../../server/http-status");
var route_1 = require("../route");
var index_1 = require("../../index");
var login_validator_1 = require("../../validators/login.validator");
var logger_1 = require("../../../logger");
var joi = require("joi");
var AuthRoute = /** @class */ (function (_super) {
    __extends(AuthRoute, _super);
    function AuthRoute(tokenService, userService) {
        var _this = _super.call(this) || this;
        _this.tokenService = tokenService;
        _this.userService = userService;
        _this.createToken = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var data, userId, token, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        data = {
                            login: req.body['login'],
                            password: req.body['password'],
                        };
                        return [4 /*yield*/, joi.validate(data, login_validator_1.loginValidator)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.userService.verifyUser(data.login, data.password)];
                    case 2:
                        userId = _a.sent();
                        if (!userId) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.tokenService.createToken(userId)];
                    case 3:
                        token = _a.sent();
                        return [2 /*return*/, res
                                .status(http_status_1.HttpStatus.OK)
                                .json({ token: token })];
                    case 4: throw { message: 'Username or password incorrent!' };
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        logger_1.default.error(req.ip, error_1);
                        return [2 /*return*/, res
                                .status(http_status_1.HttpStatus.INTERNAL_SERVER_ERROR)
                                .json(error_1)];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        _this.intializeRoutes();
        return _this;
    }
    AuthRoute.prototype.intializeRoutes = function () {
        this.router.post('/token', this.createToken);
    };
    AuthRoute = __decorate([
        inversify_1.injectable(),
        __param(0, inversify_1.inject(index_1.types.SERVICES.ITokenService)),
        __param(1, inversify_1.inject(index_1.types.SERVICES.IUserService)),
        __metadata("design:paramtypes", [Object, Object])
    ], AuthRoute);
    return AuthRoute;
}(route_1.Route));
exports.AuthRoute = AuthRoute;
