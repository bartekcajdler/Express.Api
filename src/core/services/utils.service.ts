import { injectable } from 'inversify';

export interface IUtlisService {
    getCorrectIp(expressIp: string): string;
}

@injectable()
export class UtlisService implements IUtlisService {

    getCorrectIp(expressIp: string): string {
        if (expressIp.substr(0, 7) == "::ffff:") {
            return expressIp.substr(7)
        } else {
            return expressIp;
        }
    }
}
