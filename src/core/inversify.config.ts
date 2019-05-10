import { Container, interfaces } from 'inversify';
import { types } from './inversify.types';
import { IAuthMiddleware, AuthMiddleware } from './middlewares';
import { AuthRoute, IAuthRoute, IIndexRoute, IndexRoute } from './routes';
import { IUserRepository, UserRepository } from "./repositories";
import { getCustomRepository } from "typeorm";
import Factory = interfaces.Factory;
import {
    IUtlisService, UtlisService,
    IPasswordService, PasswordService,
    ITokenService, TokenService,
    IUserService, UserService
} from './services';

const { REPOSITORIES, SERVICES, MIDDLEWARES, ROUTES } = types;
const container = new Container();

// REPOSITORIES
container
    .bind<Factory<IUserRepository>>(REPOSITORIES.IUserRepository)
    .toFactory<IUserRepository>(() => {
            return () => {
                return getCustomRepository(UserRepository);
            };
        }
    );

// SERVICES
container.bind<ITokenService>(SERVICES.ITokenService).to(TokenService);
container.bind<IUtlisService>(SERVICES.IUtlisService).to(UtlisService);
container.bind<IPasswordService>(SERVICES.IPasswordService).to(PasswordService);
container.bind<IUserService>(SERVICES.IUserService).to(UserService);

// MIDDLEWARES
container.bind<IAuthMiddleware>(MIDDLEWARES.IAuthMiddleware).to(AuthMiddleware);

// ROUTES
container.bind<IIndexRoute>(ROUTES.IIndexRoute).to(IndexRoute);
container.bind<IAuthRoute>(ROUTES.IAuthRoute).to(AuthRoute);

export { container };
