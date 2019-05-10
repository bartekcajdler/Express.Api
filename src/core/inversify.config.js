"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var inversify_types_1 = require("./inversify.types");
var middlewares_1 = require("./middlewares");
var routes_1 = require("./routes");
var services_1 = require("./services");
var repositories_1 = require("./repositories");
var typeorm_1 = require("typeorm");
var container = new inversify_1.Container();
exports.container = container;
// REPOSITORIES
container
    .bind(inversify_types_1.types.REPOSITORIES.IUserRepository)
    .toFactory(function () {
    return function () {
        return typeorm_1.getCustomRepository(repositories_1.UserRepository);
    };
});
// SERVICES
container.bind(inversify_types_1.types.SERVICES.ITokenService).to(services_1.TokenService);
container.bind(inversify_types_1.types.SERVICES.IUtlisService).to(services_1.UtlisService);
container.bind(inversify_types_1.types.SERVICES.IPasswordService).to(services_1.PasswordService);
container.bind(inversify_types_1.types.SERVICES.IUserService).to(services_1.UserService);
// MIDDLEWARES
container.bind(inversify_types_1.types.MIDDLEWARES.IAuthMiddleware).to(middlewares_1.AuthMiddleware);
// ROUTES
container.bind(inversify_types_1.types.ROUTES.IIndexRoute).to(routes_1.IndexRoute);
container.bind(inversify_types_1.types.ROUTES.IAuthRoute).to(routes_1.AuthRoute);
