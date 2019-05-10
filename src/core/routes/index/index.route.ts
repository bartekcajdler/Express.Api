import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../server/http-status';
import { IRotue, Route } from '../route';
import { IAuthMiddleware } from '../../middlewares';
import { types } from '../../index';
import config from '../../../config';
import * as ip from 'ip';
import { IUserService } from "../../services";

export interface IIndexRoute extends IRotue {
    getApiVersion : (req: Request, res: Response) => Promise<Response>,
    getPing: (req: Request, res: Response) => Promise<Response>,
    getUser: (req: Request, res: Response) => Promise<Response>
}

@injectable()
export class IndexRoute extends Route implements IIndexRoute {

    constructor(
        @inject(types.MIDDLEWARES.IAuthMiddleware) private authMiddleware: IAuthMiddleware,
        @inject(types.SERVICES.IUserService) private userService: IUserService,
    ) {
        super();
        this.intializeRoutes();
    }

    intializeRoutes(): void {
        this.router.get('/', this.getApiVersion);
        this.router.get('/ping', this.getPing);
        this.router.get('/ping-auth', this.authMiddleware.tokenGuard, this.getPing);
        this.router.get('/user', this.authMiddleware.tokenGuard, this.getUser);
    }

    getApiVersion = async (req: Request, res: Response): Promise<Response> => {
        return res.status(HttpStatus.OK).json({
            message: `API works. API version: ${config.version}. Time: ${new Date()}`,
            address: ip.address(),
            env: config.mode
        });
    };

     getPing = async (req: Request, res: Response): Promise<Response> => {
        return res.status(HttpStatus.OK).json({
            message: `Pong. Time: ${new Date()}.`
        });
    };

    getUser = async (req: Request, res: Response): Promise<Response> => {
        const userId = req['userId'];

        const user = await this.userService.getUser(userId);

        return res.status(HttpStatus.OK).json(user);
    };
}
