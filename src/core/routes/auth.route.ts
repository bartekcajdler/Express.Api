import * as joi from 'joi';
import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { HttpStatus } from '../../server/httpStatus';
import { IRotue, Route } from './route';
import { types } from '../index';
import { ITokenService, IUserService } from '../services';
import { loginValidator } from '../validators/login.validator';
import logger from '../../logger';
import { Login } from "../models/login.model";

export interface IAuthRoute extends IRotue {
}

@injectable()
export class AuthRoute extends Route implements IAuthRoute {

    constructor(
        @inject(types.ITokenService) private tokenService: ITokenService,
        @inject(types.IUserService) private userService: IUserService
    ) {
        super();
        this.onInit();
    }

    onInit(): void {
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
