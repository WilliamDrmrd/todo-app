import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entities/todo.entity';

@ApiTags('todos')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new todo' })
  @ApiResponse({
    status: 201,
    description: 'The todo has been successfully created.',
    type: TodoEntity,
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(createTodoDto);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get todo statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics of todos (total, completed, pending).',
    schema: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        completed: { type: 'number' },
        pending: { type: 'number' },
      },
    },
  })
  getStats() {
    return this.todosService.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  @ApiQuery({
    name: 'filter',
    required: false,
    enum: ['all', 'completed', 'pending'],
    description: 'Filter todos by completion status',
  })
  @ApiResponse({
    status: 200,
    description: 'List of all todos.',
    type: [TodoEntity],
  })
  findAll(@Query('filter') filter?: 'all' | 'completed' | 'pending') {
    return this.todosService.findAll(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific todo by ID' })
  @ApiResponse({
    status: 200,
    description: 'The todo with the specified ID.',
    type: TodoEntity,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully updated.',
    type: TodoEntity,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  @ApiResponse({
    status: 200,
    description: 'The todo has been successfully deleted.',
    type: TodoEntity,
  })
  @ApiResponse({ status: 404, description: 'Todo not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.todosService.remove(id);
  }
}