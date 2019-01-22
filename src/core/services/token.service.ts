import * as jwtToken from 'jsonwebtoken';
import { Token } from '../models/token.model';
import { injectable } from 'inversify';
import config from '../../config';

export interface ITokenService {
    createToken(userId: number): Promise<string>;
    verifyToken(token: string): Promise<Token>;
}

@injectable()
export class TokenService implements ITokenService {

    async createToken(userId: number): Promise<string> {
        const expiredTime = config.token_expires,
            secret = config.token_secret;
        return new Promise(((resolve, reject) => {
            jwtToken.sign(
                { userId },
                secret,
                { expiresIn: expiredTime },
                (err, token) => {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(token);
                }
            );
        }));
    }

    async verifyToken(token: string): Promise<Token> {
        const secret = config.token_secret;
        return new Promise(((resolve, reject) => {
            jwtToken.verify(
                token,
                secret, (err, decoded) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(decoded as Token)
            });
        }));
    }
}
