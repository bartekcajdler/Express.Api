import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HttpStatus } from '../../server/httpStatus';
import { IRotue, Route } from './route';
import { IAuthMiddleware } from '../middlewares';
import { types } from '../index';
import config from '../../config';
import * as ip from 'ip';
import { IUserService } from "../services";

export interface IIndexRoute extends IRotue {
}

@injectable()
export class IndexRoute extends Route implements IIndexRoute {

    constructor(
        @inject(types.IAuthMiddleware) private authMiddleware: IAuthMiddleware,
        @inject(types.IUserService) private userService: IUserService,
    ) {
        super();
        this.onInit();
    }

    onInit(): void {
        this.router.get('/', this.getApiVersion);
        this.router.get('/ping', this.getPing);
        this.router.get('/ping-auth', this.authMiddleware.tokenGuard, this.getPing);
        this.router.get('/user', this.authMiddleware.tokenGuard, this.getUser);
    }

    getApiVersion = async (req: Request, res: Response): Promise<Response> => {
        return res.status(HttpStatus.OK).json({
            message: `Payments API works. API version: ${config.version}. Time: ${new Date()}`,
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
