import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasourceImpl } from "../../infrastructure/datasource/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infrastructure/repositories/todo.repository.impl";



export class TodoRoutes {

    static get routes(): Router {

        const router = Router();

        const datasource = new TodoDatasourceImpl();
        const todoRepository = new TodoRepositoryImpl(datasource);
        const todoController = new TodosController(todoRepository);



        router.get('/', (req, res) => todoController.getTodos(req, res));
        router.get('/:todoId', (req, res) => todoController.getTodoById(req, res));

        router.post('/', (req, res) => todoController.createTodo(req, res));
        router.put('/:todoId', (req, res) => todoController.updateTodo(req, res));
        router.delete('/:todoId', (req, res) => todoController.deleteTodo(req, res));

        return router;
    }
}