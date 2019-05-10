import * as http from 'http';
import { IncomingMessage, ServerResponse } from 'http';
import * as https from 'https';
import * as fs from 'fs';
import config from '../config';
import { HttpStatus } from "./http-status";

export default class HttpServer {

    public mainHttpServer : https.Server | http.Server;
    public redirectHttpServer : http.Server;

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

    public start(ports: { https: number, http: number }):  void {
        if(config.ssl) {
            this.mainHttpServer.listen(ports.https);
            this.redirectHttpServer.listen(ports.http);
        } else {
            this.mainHttpServer.listen(ports.http);
        }
    }

    public onError(onError: (error: NodeJS.ErrnoException) => void): void {
        this.mainHttpServer.on('error', onError);
    }

    public onListening(onListening: () => void): void {
        this.mainHttpServer.on('listening', onListening);
    }
}
