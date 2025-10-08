import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async create(createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        ...createTodoDto,
        completed: createTodoDto.completed ?? false,
        priority: createTodoDto.priority ?? 'MEDIUM',
      },
    });
  }

  async findAll(filter?: 'all' | 'completed' | 'pending') {
    const where = filter && filter !== 'all'
      ? { completed: filter === 'completed' }
      : {};

    return this.prisma.todo.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: number) {
    const todo = await this.prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }

    return todo;
  }

  async update(id: number, updateTodoDto: UpdateTodoDto) {
    await this.findOne(id);

    return this.prisma.todo.update({
      where: { id },
      data: updateTodoDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.todo.delete({
      where: { id },
    });
  }

  async getStats() {
    const [total, completed] = await Promise.all([
      this.prisma.todo.count(),
      this.prisma.todo.count({ where: { completed: true } }),
    ]);

    return {
      total,
      completed,
      pending: total - completed,
    };
  }
}
