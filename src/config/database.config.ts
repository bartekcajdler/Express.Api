import { ConnectionOptions } from 'typeorm';
import { config } from './main.config';

const dbConfig: ConnectionOptions = {
    type: 'mysql',
    host: config.db_host,
    port: config.db_port,
    username: config.db_user,
    password: config.db_password,
    database: config.db_name,
    synchronize: false,
    entities: [
        `${__dirname}/../core/entities/*.js`
    ],
    logging: config.db_logs,
    logger: config.db_logs_type
};

export { dbConfig };
