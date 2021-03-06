import { Router } from 'express';
import { injectable } from 'inversify';

export interface IRotue {
    getRouter(): Router;
}

@injectable()
export abstract class Route {
    protected router: Router;

    constructor() {
        this.router = Router();
    }

    public getRouter(): Router {
        return this.router;
    }

    abstract intializeRoutes(): void;
}
