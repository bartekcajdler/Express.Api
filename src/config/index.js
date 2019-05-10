"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var main_config_1 = require("./main.config");
// database config
__export(require("./database.config"));
// main config
exports.default = main_config_1.config;
