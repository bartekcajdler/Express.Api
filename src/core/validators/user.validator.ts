import * as joi from 'joi';

export const userValidator = joi.object().keys({
    username: joi.string().required(),
    password: joi.string().required(),
});