import { Router } from "express";
import { TodosController } from "./controller";



export class TodoRoutes {

    static get routes(): Router {

        const router = Router();
        const todoController = new TodosController();

        router.get('/', (req, res) => todoController.getTodos(req, res));
        router.get('/:todoId', (req, res) => todoController.getTodoById(req, res));

        router.post('/', (req, res) => todoController.createTodo(req, res));

        router.put('/:todoId', (req, res) => todoController.updateTodo(req, res));

        router.delete('/:todoId', (req, res) => todoController.deleteTodo(req, res));



        return router;
    }
}