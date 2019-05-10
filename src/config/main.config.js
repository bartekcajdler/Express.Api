"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mode = process.env.NODE_ENV;
var config = require("../config." + (mode ? mode : 'development') + ".json");
exports.config = config;
config.mode = mode;
