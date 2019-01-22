import { inject, injectable } from 'inversify';
import { types } from "../inversify.types";
import { IPasswordService } from "./password.service";
import { IUserRepository } from "../repositories";
import { User } from "../entities/user.entity";
import { User as UserModel } from '../models/user.model';

export interface IUserService {
    addUser(login: string, password: string): Promise<number>;
    verifyUser(login: string, password: string): Promise<number | null>;
    getUser(userId: number): Promise<UserModel>
}

@injectable()
export class UserService implements IUserService {
    private userRepository: IUserRepository;

    constructor(
        @inject(types.IPasswordService) private passwordService: IPasswordService,
        @inject(types.IUserRepository) private userRepositoryFactory: () => IUserRepository) {
        this.userRepository = userRepositoryFactory();
    }

    async addUser(login: string, password: string): Promise<number> {
        const hash = await this.passwordService.createPassword(password);
        const user: User = await this.userRepository.createAndSave(login, hash);
        return user.id;
    }

    async verifyUser(login: string, password: string): Promise<number> {
        const user: User = await this.userRepository.findUserByLogin(login);
        if (user) {
            const result = await this.passwordService.verifyPassword(password, user.password);
            if (result) {
                return user.id;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async getUser(userId: number): Promise<UserModel> {
        const user: User = await this.userRepository.findUserById(userId);
        return {
            login: user.login,
            createdAt: user.createdAt
        }
    }
}
