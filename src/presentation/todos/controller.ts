import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";


export class TodosController {

    //* DI
    constructor(
        private readonly todoRepository: TodoRepository
    ) { }

    private handleError = (res: Response, error: unknown) => {
        if (error instanceof CustomError) {
            res.status(error.statusCode).json({ error: error.message });
            return;
        }

        res.status(500).json({ error: 'Internal server error - check logs ' });
    }

    public getTodos = (req: Request, res: Response) => {

        new GetTodos(this.todoRepository)
            .execute()
            .then(todos => res.json(todos))
            .catch(error => this.handleError(res, error));
    }

    public getTodoById = (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' })

        new GetTodo(this.todoRepository)
            .execute(todoId)
            .then(todo => res.json(todo))
            .catch(error => this.handleError(res, error));
    }


    public createTodo = (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new CreateTodo(this.todoRepository)
            .execute(createTodoDto!)
            .then(newTodo => res.status(201).json(newTodo))
            .catch(error => this.handleError(res, error));

    }

    public updateTodo = (req: Request, res: Response) => {
        const todoId = +req.params.todoId;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id: todoId });
        if (error) return res.status(400).json({ error });

        new UpdateTodo(this.todoRepository)
            .execute(updateTodoDto!)
            .then(updatedTodo => res.json(updatedTodo))
            .catch(error => this.handleError(res, error));
    }

    public deleteTodo = (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' });

        new DeleteTodo(this.todoRepository)
            .execute(todoId)
            .then(deletedTodo => res.json(deletedTodo))
            .catch(error => this.handleError(res, error));

    }

}