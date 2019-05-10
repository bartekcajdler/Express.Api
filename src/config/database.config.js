"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var main_config_1 = require("./main.config");
var dbConfig = {
    type: 'mysql',
    host: main_config_1.config.db_host,
    port: main_config_1.config.db_port,
    username: main_config_1.config.db_user,
    password: main_config_1.config.db_password,
    database: main_config_1.config.db_name,
    synchronize: true,
    entities: [
        __dirname + "/../core/entities/*.js"
    ],
    logging: main_config_1.config.db_logs,
    logger: main_config_1.config.db_logs_type
};
exports.dbConfig = dbConfig;
