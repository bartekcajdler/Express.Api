"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var joi = require("joi");
exports.loginValidator = joi.object().keys({
    login: joi.string().required(),
    password: joi.string().required(),
});
