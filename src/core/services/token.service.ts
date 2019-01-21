import * as jwtToken from 'jsonwebtoken';
import config from '../../config';
import { UserData } from '../models/user-data.model';
import { injectable } from 'inversify';

export interface ITokenService {
    createToken(userId: number): Promise<string>;
    verifyToken(token: string): Promise<UserData>;
}

@injectable()
export class TokenService implements ITokenService {

    createToken(userId: number): Promise<string> {
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

    async verifyToken(token: string): Promise<UserData> {
        const secret = config.token_secret;
        return new Promise(((resolve, reject) => {
            jwtToken.verify(
                token,
                secret, (err, decoded) => {
                if(err) {
                    reject(err);
                    return;
                }
                resolve(decoded as UserData)
            });
        }));
    }
}
