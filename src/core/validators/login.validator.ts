import * as joi from 'joi';

export const loginValidator = joi.object().keys({
    login: joi.string().required(),
    password: joi.string().required(),
});
