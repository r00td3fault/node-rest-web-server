import { Request, Response } from "express";
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


export class TodosController {

    //* DI
    constructor() { }


    public getTodos = async (req: Request, res: Response) => {
        const todos = await prisma.todo.findMany();
        return res.json(todos);
    }

    public getTodoById = async (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' })

        const todo = await prisma.todo.findUnique({
            where: {
                id: todoId
            }
        });

        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `Todo with id ${todoId} not found` });
    }


    public createTodo = async (req: Request, res: Response) => {
        const [error, createTodoDto] = CreateTodoDto.create(req.body);
        if (error) return res.status(400).json({ error });

        const todo = await prisma.todo.create({
            data: createTodoDto!
        });

        res.json(todo);

    }

    public updateTodo = async (req: Request, res: Response) => {
        const todoId = +req.params.todoId;
        const [error, updateTodoDto] = UpdateTodoDto.create({ ...req.body, id: todoId });
        if (error) return res.status(400).json({ error });

        const todoToUpdate = await prisma.todo.findUnique({
            where: {
                id: todoId
            }
        });
        if (!todoToUpdate) return res.status(404).json({ error: `Todo with id ${todoId} not found` });

        const updatedTodo = await prisma.todo.update({
            where: {
                id: todoId
            },
            data: updateTodoDto!.values
        });

        res.json(updatedTodo);

    }

    public deleteTodo = async (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' });

        const todoToDelete = await prisma.todo.findUnique({
            where: {
                id: todoId
            }
        });
        if (!todoToDelete) return res.status(404).json({ error: `Todo with id ${todoId} not found` });

        const deletedTodo = await prisma.todo.delete({
            where: {
                id: todoId
            },
        });

        res.json({ deleted: deletedTodo });

    }

}