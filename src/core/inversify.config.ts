import { Container } from 'inversify';
import { types } from './inversify.types';
import { ITokenService, TokenService } from './services/token.service';
import { IAuthMiddleware, AuthMiddleware } from './middlewares/auth.middleware';
import { IIndexRoute, IndexRoute } from './routes';

import {
    IUtlisService,
    UtlisService,
} from './services';

const container = new Container();

// SERVICES
container.bind<ITokenService>(types.TOKEN_SERVICE).to(TokenService);
container.bind<IUtlisService>(types.UTLIS_SERVICE).to(UtlisService);


// MIDDLEWARES
container.bind<IAuthMiddleware>(types.AUTH_MIDDLEWARE).to(AuthMiddleware);

// ROUTES

container.bind<IIndexRoute>(types.INDEX_ROUTE).to(IndexRoute);

export { container };
