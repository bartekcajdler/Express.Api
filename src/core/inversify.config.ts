import { Container, interfaces } from 'inversify';
import { types } from './inversify.types';
import { IAuthMiddleware, AuthMiddleware } from './middlewares';
import { AuthRoute, IAuthRoute, IIndexRoute, IndexRoute } from './routes';
import {
    IUtlisService, UtlisService,
    IPasswordService, PasswordService,
    ITokenService, TokenService,
    IUserService, UserService
} from './services';
import { IUserRepository, UserRepository } from "./repositories";
import { EntityManager } from "typeorm";
import { getCustomRepository } from "typeorm";
import Factory = interfaces.Factory;

const container = new Container();

// REPOSITORIES
container
    .bind<Factory<IUserRepository>>(types.IUserRepository)
    .toFactory<IUserRepository>(() => {
            return () => {
                return getCustomRepository(UserRepository);
            };
        }
    );

// SERVICES
container.bind<ITokenService>(types.ITokenService).to(TokenService);
container.bind<IUtlisService>(types.IUtlisService).to(UtlisService);
container.bind<IPasswordService>(types.IPasswordService).to(PasswordService);
container.bind<IUserService>(types.IUserService).to(UserService);

// MIDDLEWARES
container.bind<IAuthMiddleware>(types.IAuthMiddleware).to(AuthMiddleware);

// ROUTES
container.bind<IIndexRoute>(types.IIndexRoute).to(IndexRoute);
container.bind<IAuthRoute>(types.IAuthRoute).to(AuthRoute);

export { container };
