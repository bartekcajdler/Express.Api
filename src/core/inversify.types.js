"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = {
    SERVICES: {
        ITokenService: Symbol.for('token.service'),
        IUtlisService: Symbol.for('utils.service'),
        IPasswordService: Symbol.for('password.service'),
        IUserService: Symbol.for('user.service'),
    },
    REPOSITORIES: {
        IUserRepository: Symbol.for('user.repository'),
    },
    MIDDLEWARES: {
        IAuthMiddleware: Symbol.for('auth.middleware'),
    },
    ROUTES: {
        IIndexRoute: Symbol.for('index.route'),
        IAuthRoute: Symbol.for('auth.route')
    }
};
exports.types = types;
