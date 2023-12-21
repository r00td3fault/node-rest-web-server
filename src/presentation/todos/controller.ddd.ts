import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";


export class TodosController {

    //* DI
    constructor(
        private readonly todoRepository: TodoRepository
    ) { }


    public getTodos = async (req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' })

        try {
            const todo = await this.todoRepository.findById(todoId);
            res.json(todo);
        } catch (error) {
            res.status(400).json({ error });
        }
    }


    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        const newTodo = await this.todoRepository.create(createTodoDto!);
        res.json(newTodo);

    }

    public updateTodo = async (req: Request, res: Response) => {
        const todoId = +req.params.todoId;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id: todoId });
        if (error) return res.status(400).json({ error });

        try {
            const updatedTodo = await this.todoRepository.updateById(updateTodoDto!);
            res.json(updatedTodo);
        } catch (error) {
            res.status(400).json({ error });
        }

    }

    public deleteTodo = async (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' });

        try {
            const deletedTodo = await this.todoRepository.deleteById(todoId);
            res.json(deletedTodo);
        } catch (error) {
            console.log(error)
            res.status(400).json({ error });
        }

    }

}