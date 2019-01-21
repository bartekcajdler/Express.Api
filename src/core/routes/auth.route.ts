import * as joi from 'joi';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HttpStatus } from '../../server/httpStatus';
import { IRotue, Route } from './route';
import { IAuthMiddleware } from '../middlewares';
import { types } from '../index';
import { ITokenService } from '../services';
import { userValidator } from '../validators/user.validator';
import logger from '../../logger';
import config from '../../config';

export interface IAuthRoute extends IRotue {
}

@injectable()
export class AuthRoute extends Route implements IAuthRoute {

    constructor(
        @inject(types.AUTH_MIDDLEWARE) private authMiddleware: IAuthMiddleware,
        @inject(types.TOKEN_SERVICE) private tokenService: ITokenService,
    ) {
        super();
        this.onInit();
    }

    onInit(): void {
        this.router.post('/token', this.createToken);
    }

    createToken = async (req: Request, res: Response): Promise<Response> => {
        try {
            const data = {
                username: req.body['username'],
                password: req.body['password'],
            };

            await joi.validate(data, userValidator);

            if (data.username === config.username && data.password === config.password) {
                const token = await this.tokenService.createToken(38);
                return res
                    .status(HttpStatus.OK)
                    .json({token});
            } else {
                throw { message: 'Username or password incorrent!'};
            }
        } catch(error) {
            logger.error(req.ip, error);
            return res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(error);
        }
    };

}
