import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Todos API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.todo.deleteMany({});
  });

  describe('POST /todos', () => {
    it('should create a todo successfully', async () => {
      const createTodoDto = {
        title: 'Test todo',
        completed: false,
      };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: 'Test todo',
        completed: false,
        priority: 'MEDIUM',
        createdAt: expect.any(String),
      });
    });

    it('should create a todo with custom priority', async () => {
      const createTodoDto = {
        title: 'High priority task',
        priority: 'HIGH',
      };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: 'High priority task',
        priority: 'HIGH',
        completed: false,
      });
    });

    it('should reject invalid priority value', async () => {
      const createTodoDto = {
        title: 'Test todo',
        priority: 'INVALID',
      };

      await request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto)
        .expect(400);
    });

    it('should return error when creating todo without title', async () => {
      const createTodoDto = {
        completed: false,
      };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([expect.stringContaining('title')])
      );
    });

    it('should return error when title is empty string', async () => {
      const createTodoDto = {
        title: '',
        completed: false,
      };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .send(createTodoDto)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /todos/:id', () => {
    it('should return 404 when getting non-existent todo', async () => {
      const nonExistentId = 99999;

      const response = await request(app.getHttpServer())
        .get(`/todos/${nonExistentId}`)
        .expect(404);

      expect(response.body.message).toContain('not found');
    });

    it('should get a specific todo by id', async () => {
      // Create a todo first
      const todo = await prisma.todo.create({
        data: {
          title: 'Test todo',
          completed: false,
        },
      });

      const response = await request(app.getHttpServer())
        .get(`/todos/${todo.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: todo.id,
        title: 'Test todo',
        completed: false,
      });
    });
  });

  describe('GET /todos', () => {
    it('should get all todos', async () => {
      // Create multiple todos
      await prisma.todo.createMany({
        data: [
          { title: 'Todo 1', completed: false },
          { title: 'Todo 2', completed: true },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('completed');
    });

    it('should return empty array when no todos exist', async () => {
      const response = await request(app.getHttpServer())
        .get('/todos')
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should filter completed todos', async () => {
      await prisma.todo.createMany({
        data: [
          { title: 'Todo 1', completed: false },
          { title: 'Todo 2', completed: true },
          { title: 'Todo 3', completed: true },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/todos?filter=completed')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(todo => todo.completed === true)).toBe(true);
    });

    it('should filter pending todos', async () => {
      await prisma.todo.createMany({
        data: [
          { title: 'Todo 1', completed: false },
          { title: 'Todo 2', completed: true },
          { title: 'Todo 3', completed: false },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/todos?filter=pending')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body.every(todo => todo.completed === false)).toBe(true);
    });

    it('should return all todos with filter=all', async () => {
      await prisma.todo.createMany({
        data: [
          { title: 'Todo 1', completed: false },
          { title: 'Todo 2', completed: true },
        ],
      });

      const response = await request(app.getHttpServer())
        .get('/todos?filter=all')
        .expect(200);

      expect(response.body).toHaveLength(2);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should update a todo', async () => {
      const todo = await prisma.todo.create({
        data: {
          title: 'Original title',
          completed: false,
        },
      });

      const updateTodoDto = {
        title: 'Updated title',
        completed: true,
      };

      const response = await request(app.getHttpServer())
        .put(`/todos/${todo.id}`)
        .send(updateTodoDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: todo.id,
        title: 'Updated title',
        completed: true,
      });
    });

    it('should update todo priority', async () => {
      const todo = await prisma.todo.create({
        data: {
          title: 'Test todo',
          completed: false,
        },
      });

      const updateTodoDto = {
        priority: 'HIGH',
      };

      const response = await request(app.getHttpServer())
        .put(`/todos/${todo.id}`)
        .send(updateTodoDto)
        .expect(200);

      expect(response.body).toMatchObject({
        id: todo.id,
        priority: 'HIGH',
      });
    });

    it('should return 404 when updating non-existent todo', async () => {
      const nonExistentId = 99999;

      await request(app.getHttpServer())
        .put(`/todos/${nonExistentId}`)
        .send({ title: 'Updated title' })
        .expect(404);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete a todo', async () => {
      const todo = await prisma.todo.create({
        data: {
          title: 'Todo to delete',
          completed: false,
        },
      });

      await request(app.getHttpServer())
        .delete(`/todos/${todo.id}`)
        .expect(200);

      // Verify todo is deleted
      const deletedTodo = await prisma.todo.findUnique({
        where: { id: todo.id },
      });

      expect(deletedTodo).toBeNull();
    });

    it('should return 404 when deleting non-existent todo', async () => {
      const nonExistentId = 99999;

      await request(app.getHttpServer())
        .delete(`/todos/${nonExistentId}`)
        .expect(404);
    });
  });
});
