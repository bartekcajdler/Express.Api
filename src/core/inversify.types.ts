const types = {
    ITokenService: Symbol.for('token.service'),
    IUtlisService: Symbol.for('utils.service'),
    IPasswordService: Symbol.for('password.service'),
    IUserService: Symbol.for('user.service'),
    IUserRepository: Symbol.for('user.repository'),
    IAuthMiddleware: Symbol.for('auth.middleware'),
    IIndexRoute: Symbol.for('index.route'),
    IAuthRoute: Symbol.for('auth.route')
};

export { types };
