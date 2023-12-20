import { Router } from "express";
import { TodoRoutes } from './todos/routes';



export class AppRoutes {

    static get routes(): Router {

        const router = Router();

        router.use('/api/todos', TodoRoutes.routes);
        router.use('/api/todos/:todoId', TodoRoutes.routes);


        return router;
    }
}