import { Request, Response } from "express";

const todos = [
    { id: 1, text: 'Buy milk!', completedAt: new Date() },
    { id: 2, text: 'Buy bread!', completedAt: null },
    { id: 3, text: 'Buy butter!', completedAt: new Date() },
];


export class TodosController {

    //* DI
    constructor() { }


    public getTodos = (req: Request, res: Response) => {
        return res.json(todos);
    }

    public getTodoById = (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' })

        const todo = todos.find(todoItem => todoItem.id === Number(todoId));

        (todo)
            ? res.json(todo)
            : res.status(404).json({ error: `Todo with id ${todoId} not found` });
    }


    public createTodo = (req: Request, res: Response) => {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: 'text is required' });
        const maxId = todos.reduce((act, current) => {
            return (act && act.id > current.id) ? act : current
        });

        const todo = {
            id: maxId.id + 1,
            text,
            completedAt: null
        };

        todos.push(todo);
        console.log(todos);
        res.json(todo);

    }

    public updateTodo = (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' });

        const todoToUpdate = todos.find(todo => todo.id === todoId);
        if (!todoToUpdate?.id) return res.status(404).json({ error: `Todo with id ${todoId} not found` });

        const { text, completedAt } = req.body;

        todoToUpdate.text = text ?? todoToUpdate.text;
        (completedAt === null)
            ? todoToUpdate.completedAt = null
            : todoToUpdate.completedAt = new Date(completedAt || todoToUpdate.completedAt);
        res.json(todoToUpdate);

    }

    public deleteTodo = (req: Request, res: Response) => {
        const todoId = Number(req.params.todoId);
        if (isNaN(todoId)) return res.status(400).json({ error: 'ID must be a number' });

        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        if (todoIndex === -1) return res.status(404).json({ error: `Todo with id ${todoId} not found` });

        const deletedTodo = todos.splice(todoIndex, 1);

        res.json({ deleted: deletedTodo, newList: todos });

    }

}