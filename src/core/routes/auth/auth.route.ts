import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HttpStatus } from '../../../server/http-status';
import { IRotue, Route } from '../route';
import { types } from '../../index';
import { ITokenService, IUserService } from '../../services';
import { loginValidator } from '../../validators/login.validator';
import logger from '../../../logger';
import { Login } from "../../models/login.model";
import * as joi from 'joi';

export interface IAuthRoute extends IRotue {
    createToken: (req: Request, res: Response) => Promise<Response>,
}

@injectable()
export class AuthRoute extends Route implements IAuthRoute {

    constructor(
        @inject(types.SERVICES.ITokenService) private tokenService: ITokenService,
        @inject(types.SERVICES.IUserService) private userService: IUserService
    ) {
        super();
        this.intializeRoutes();
    }

    intializeRoutes(): void {
        this.router.post('/token', this.createToken);
    }

    createToken = async (req: Request, res: Response): Promise<Response> => {
        try {
            const data: Login = {
                login: req.body['login'],
                password: req.body['password'],
            };

            await joi.validate(data, loginValidator);

            const userId = await this.userService.verifyUser(data.login, data.password);

            if (userId) {
                const token = await this.tokenService.createToken(userId);
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
