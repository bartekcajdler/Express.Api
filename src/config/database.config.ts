import { config } from './main.config';
import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

const dbConfig: MysqlConnectionOptions = {
    type: 'mysql',
    host: config.db_host,
    port: config.db_port,
    username: config.db_user,
    password: config.db_password,
    database: config.db_name,
    synchronize: true,
    entities: [
        `${__dirname}/../core/entities/*.js`
    ],
    logging: config.db_logs,
    logger: config.db_logs_type
};

export { dbConfig };
