export interface IConfig {
    version: string;
    env: string;
    api_version_url: string;
    port_http: number;
    port_http_default: number;
    port_https: number;
    express_logs: boolean;
    level: string;
    swagger: boolean;
    logs_folder: string;
    token_expires: number | string;
    token_secret: string;
    password_secret: string;
    db_host: string;
    db_user: string;
    db_password: string;
    db_name: string;
    db_port: number;
    db_logs: boolean;
    db_logs_type: "advanced-console" | "simple-console" | "file" | "debug";
    ssl: boolean;
    ssl_key: string;
    ssl_cert: string;
    mode: string,
    username: string,
    password: string,
}

const mode = process.env.NODE_ENV;
let config: IConfig = require(`../config.${mode}.json`);
config.mode = mode;

export { config };
