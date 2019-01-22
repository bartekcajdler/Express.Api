import { EntityRepository, Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { injectable } from 'inversify';

export interface IUserRepository {
    findUserByLogin(login: string);
    findUserById(userId: number);
    createAndSave(login: string, password: string);
}

@injectable()
@EntityRepository(User)
export class UserRepository extends Repository<User> implements IUserRepository {

    async findUserByLogin(login: string) {
        return this.findOne({ where: { login: login }});
    }

    async findUserById(userId: number) {
        return this.findOne({ where: { id: userId }});
    }

    async createAndSave(login: string, password: string) {
        const user = new User(login, password);
        return this.manager.save(user);
    }
}
