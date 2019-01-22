import * as dotenv from "dotenv";
dotenv.config();

import 'reflect-metadata';
import App from './app';
import HttpServer from './server/httpServer';
import { createConnection } from 'typeorm';
import config, { dbConfig } from './config';
import logger from './logger';
// import { container, types } from "./core";
// import { IUserService } from "./core/services";

(async () => {
    try {

        await createConnection(dbConfig);

        logger.info(`Running mode: ${config.mode}`);
        logger.info(`Database ${dbConfig.database} (${dbConfig.host}:${dbConfig.port}) connected.`);

        // const userService = container.get<IUserService>(types.IUserService);
        //
        // await userService.addUser('demo','demo');

        const app = new App().getInstance();
        const server = new HttpServer(app);

        server.start();
    } catch(e) {
        logger.error(e);
    }
})();
