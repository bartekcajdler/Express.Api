import { injectable } from 'inversify';
import * as bcrypt from 'bcrypt-nodejs';

export interface IPasswordService {
    createPassword(password: string): Promise<string>;
    verifyPassword(password: string, hash: string): Promise<boolean>;
}

@injectable()
export class PasswordService implements IPasswordService {

    async createPassword(password: string): Promise<string> {
        return new Promise(((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if(err) {
                    reject(err);
                    return;
                }
                bcrypt.hash(password, salt, ()=>{}, (err, hash) => {
                    if(err) {
                        reject(err);
                        return;
                    }
                    resolve(hash);
                });
            });
        }));
    }

    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return new Promise(((resolve, reject) => {
            bcrypt.compare(password, hash, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        }));
    }
}
