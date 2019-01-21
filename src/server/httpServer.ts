import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import * as https from 'https';
import * as fs from 'fs';
import logger from '../logger';
import config from '../config';
import { HttpStatus } from "./httpStatus";

export default class HttpServer {

    private mainHttpServer : https.Server | http.Server;
    private redirectHttpServer : http.Server;

    constructor(app: (req: IncomingMessage, res: ServerResponse) => void) {
        if(config.ssl) {
            const options = {
                key: fs.readFileSync(`${__dirname}/${config.ssl_key}`),
                cert: fs.readFileSync(`${__dirname}/${config.ssl_cert}`),
            };
            const redirectApp = (req: IncomingMessage, res: ServerResponse): void => {
                res.writeHead(HttpStatus.MOVED_PERMANENTLY, {
                    "Location": "https://" + req.headers['host'] + req.url
                });
                res.end();
            };

            this.mainHttpServer = https.createServer(options, app);
            this.redirectHttpServer = http.createServer(redirectApp);
        } else {
            this.mainHttpServer = http.createServer(app);
        }
    }

    public start(): void {
        if(config.ssl) {
            this.mainHttpServer.listen(config.port_https);
            this.redirectHttpServer.listen(config.port_http_default);
        } else {
            this.mainHttpServer.listen(config.port_http);
        }
        this.initEvents();
    }

    private initEvents(): void {
        this.mainHttpServer.on('error', this.onError);
        this.mainHttpServer.on('listening', this.onListening);
    }

    private onError(error: NodeJS.ErrnoException): void {
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
    }

    private onListening(): void {
        const port = config.ssl ? config.port_https : config.port_http;
        const type = config.ssl ? 'HTTPS' : 'HTTP';

        logger.info(`${type} server  listening on port ${port}`);

        if (config.ssl) {
            logger.info(`Redirect HTTP server listening on port ${config.port_http_default}`);
        }
    }
}