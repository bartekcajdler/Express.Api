import * as express from 'express';
import { Application, Request, Response, Errback, NextFunction } from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import { HttpStatus } from './server/httpStatus';
import { IAuthRoute, IIndexRoute } from './core/routes';
import { container, types } from './core';
import config from './config';
import * as swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import * as Guid from 'uuid/v1';

export default class App {

	private readonly express: Application;
	private apiUrl: string = `/api/${config.api_version_url}`;
	private docUrl: string = `/api-docs`;

	constructor() {
		this.express = express();
		this.security();
		this.port();
		this.middleware();
		this.routes();
	}

	public getInstance(): Application {
		return this.express;
	}

	private port(): void {
		this.express.set('port', config.port_http);
	}

	private security(): void {
		this.express.use(helmet());
		this.express.disable('x-powered-by');
	}

	private middleware(): void {
		if(config.express_logs) {
			this.express.use(logger('dev'));
		}
		this.express.use(bodyParser.json({ limit: '10mb'}));
		this.express.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
	}

	private routes(): void {

		this.express.all('*', (req: Request, res: Response, next: NextFunction) => {
			res.header('Access-Control-Allow-Origin', '*');
			res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token");
			next();
		});

		this.express.use((req: Request, res: Response, next: NextFunction) => {
			req['id'] = Guid();
			next();
		});

		this.customRoutes();

		this.express.use((req: Request, res: Response) => {
			res.status(HttpStatus.NOT_FOUND).json({
				status: HttpStatus.NOT_FOUND,
				error: 'Not found.'
			});
		});

		this.express.use((err: Errback, req: Request, res: Response) => {
			res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				error: 'Internal server error.'
			});
		});
	}

	private customRoutes() {
		const routes = [
			container.get<IIndexRoute>(types.IIndexRoute),
			container.get<IAuthRoute>(types.IAuthRoute)
		];

		routes.forEach((route) => {
			this.express.use(this.apiUrl, route.getRouter());
		});

        if (config.swagger) {
        	const swagger = this.getSwaggerSpecs();
			this.express.use(this.docUrl, swaggerUi.serve, swaggerUi.setup(swagger));
		}
    }

    private getSwaggerSpecs(): any {
		let url = '';
		if (config.mode === 'development') {
			url = './src/core/routes/*.yaml';
		} else {
			url = './core/routes/*.yaml';
		}
        const options = {
            swaggerDefinition: {
                info: {
                    title: `Api ${config.api_version_url}`,
                    version: '1.0.0',
                    description: 'Swagger for API',
                },
				basePath: this.apiUrl,
				securityDefinitions: {
					jwt: {
						type: 'apiKey',
						name: 'token',
						in: 'header'
					}
				},
				security: [
					{ jwt: [] }
				]
            },
            apis: [url],
			securityDefinitions: {
				auth: {
					type: 'basic'
				}
			},
        };

        return swaggerJsdoc(options);
	}
}
