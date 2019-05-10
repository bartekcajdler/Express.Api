import * as dotenv from "dotenv";
dotenv.config();

import 'reflect-metadata';
import App from './app';
import HttpServer from './server/http-server';
import { createConnection } from 'typeorm';
import config, { dbConfig } from './config';
import logger from './logger';
import { container, types } from "./core";
import { IAuthRoute, IIndexRoute } from "./core/routes";

(async () => {
    try {

        await createConnection(dbConfig);

        logger.info(`Running mode: ${config.mode}`);
        logger.info(`Database ${dbConfig.database} (${dbConfig.host}:${dbConfig.port}) connected.`);

        const { ROUTES } = types;

        const routes = [
            container.get<IIndexRoute>(ROUTES.IIndexRoute),
            container.get<IAuthRoute>(ROUTES.IAuthRoute)
        ];

        const app = new App(routes).getInstance();
        const server = new HttpServer(app);

        server.onError((error: NodeJS.ErrnoException) => {
            let port = config.ssl ? config.port_https : config.port_http;
            switch(error.code) {
                case 'EACCES':
                    logger.error(`Port ${port} requires elevated privileges`);
                    process.exit(1);
                    break;
                case 'EADDRINUSE':
                    logger.error(`Port ${port} is already in use`);
                    process.exit(1);
                    break;
                default:
                    throw error;
            }
        });

        server.onListening(() => {
            const port = config.ssl ? config.port_https : config.port_http;
            const type = config.ssl ? 'HTTPS' : 'HTTP';

            logger.info(`${type} server  listening on port ${port}`);

            if (config.ssl) {
                logger.info(`Redirect HTTP server listening on port ${config.port_http_default}`);
            }
        });

        server.start({
            http: config.port_http,
            https: config.port_https
        });

    } catch(e) {
        logger.error(e);
    }
})();


