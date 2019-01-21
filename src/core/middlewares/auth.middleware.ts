import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../../server/httpStatus';
import { UserData } from '../models/user-data.model';
import { types } from '../index';
import { ITokenService } from '../services';
import logger from '../../logger/index';

export interface IAuthMiddleware {
    tokenGuard(req: Request, res: Response, next: NextFunction): Promise<Response>;
}

@injectable()
export class AuthMiddleware implements IAuthMiddleware {

    constructor(
        @inject(types.TOKEN_SERVICE) private tokenService: ITokenService) {
    }

    tokenGuard = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
        const token =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.headers['token'];

        if (token) {
            try {
                let userData: UserData = await this.tokenService.verifyToken(token);
                if (!userData.userId) {
                    return res.status(HttpStatus.FORBIDDEN).json({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    req['userId'] = userData.userId;
                    next();
                }
            } catch(e) {
                logger.error(e);
                return res.status(HttpStatus.FORBIDDEN).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            }
        } else {
            return res.status(HttpStatus.FORBIDDEN).json({
                success: false,
                message: 'No token provided.'
            });
        }
    }
}