import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';

describe('Todo route testing', () => {

    beforeAll(async () => {
        await testServer.start();
    });

    afterAll(async () => {
        testServer.close();
        await prisma.todo.deleteMany();
    });

    beforeEach(async () => {
        await prisma.todo.deleteMany();
    });

    const todo1 = { text: 'Hola 1' };
    const todo2 = { text: 'Hola 2' };


    test('should return TODOs  -> GET api/todos', async () => {

        await prisma.todo.createMany({
            data: [todo1, todo2]
        });

        const { body } = await request(testServer.app)
            .get('/api/todos')
            .expect(200);

        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(2);
        expect(body).toMatchObject([todo1, todo2]);

    });

    test('should return a specific TODO  -> GET api/todos/:todoId', async () => {

        await prisma.todo.createMany({
            data: [todo1]
        });

        const todo = await prisma.todo.findFirst({
            where: {
                text: todo1.text,
            },
        });

        const { body } = await request(testServer.app)
            .get(`/api/todos/${todo!.id}`)
            .expect(200);

        expect(body).toBeInstanceOf(Object);
        expect(body).toMatchObject(todo1);

    });

    test('should return 404 not found -> GET api/todos/:todoId', async () => {
        await prisma.todo.createMany({
            data: [todo1]
        });

        const todo = await prisma.todo.findFirst({
            where: {
                text: todo1.text,
            },
        });

        const todoId = todo!.id + 5;

        const { body } = await request(testServer.app)
            .get(`/api/todos/${todoId}`)
            .expect(404);

        expect(body.error).toBeDefined()
        expect(body.error).toContain(`Todo with id ${todoId} not found`);
    });


    test('should create TODO and return new TODO -> POST api/todos', async () => {

        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send(todo1)
            .expect(201);

        expect(body.error).toBeUndefined();
        expect(body).toEqual({
            id: expect.any(Number),
            text: todo1.text,
            completedAt: null
        });
    });

    test('should return error when create a TODO if text is empty -> POST api/todos', async () => {

        const { body } = await request(testServer.app)
            .post('/api/todos')
            .send({ text: '' })
            .expect(400);

        expect(body.error).toBeDefined();
        expect(body.error).toContain('Text property is required');
    });


    test('should update TODO and return updated TODO -> PUT api/todos/:todoId', async () => {

        const textMessage = 'texto de prueba';
        const date = '2024-01-01';

        await prisma.todo.create({
            data: todo1
        });

        const todo = await prisma.todo.findFirst({
            where: {
                text: todo1.text,
            },
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo!.id}`)
            .send({
                text: textMessage,
                completedAt: date
            })
            .expect(200);

        const updatedTodo = await prisma.todo.findFirst({
            where: {
                id: todo?.id,
            },
        });

        expect(body.error).toBeUndefined();
        expect(body).toMatchObject({
            id: todo!.id,
            text: textMessage,
            completedAt: new Date(date).toISOString()
        });
        expect(updatedTodo?.text).toBe(textMessage);
        expect(updatedTodo?.completedAt?.toISOString()).toBe(new Date(date).toISOString());
    });

    test('should return error when send invalid date to update TODO -> PUT api/todos/:todoId', async () => {

        const textMessage = 'texto de prueba';
        const date = 'sadsadsads';

        await prisma.todo.create({
            data: todo1
        });

        const todo = await prisma.todo.findFirst({
            where: {
                text: todo1.text,
            },
        });

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todo!.id}`)
            .send({
                text: textMessage,
                completedAt: date
            })
            .expect(400);


        expect(body.error).toBeDefined();
        expect(body.error).toContain('CompletedAt must be a valid date');
    });

    test('should return 404 error when TODO not found -> PUT api/todos/:todoId', async () => {

        const textMessage = 'texto de prueba';


        await prisma.todo.create({
            data: todo1
        });

        const todo = await prisma.todo.findFirst({
            where: {
                text: todo1.text,
            },
        });

        const todoId = todo!.id + 10;

        const { body } = await request(testServer.app)
            .put(`/api/todos/${todoId}`)
            .send({
                text: textMessage,
            })
            .expect(404);


        expect(body.error).toBeDefined();
        expect(body.error).toContain(`Todo with id ${todoId} not found`);
    });


    test('should delete TODO -> DELETE api/todos/:todoId', async () => {

        await prisma.todo.createMany({
            data: [todo1, todo2]
        });

        const todos = await prisma.todo.findMany();

        const todo = todos.find(todo => todo.text === todo1.text);

        const { body } = await request(testServer.app)
            .delete(`/api/todos/${todo?.id}`)
            .expect(200);

        const newTodos = await prisma.todo.findMany();

        expect(body.error).toBeUndefined();
        expect(body).toMatchObject(todo!);
        expect(newTodos.length).toBe(1);
        expect(newTodos[0].text).toBe(todo2.text);

    });
});