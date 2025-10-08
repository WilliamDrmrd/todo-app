import { ApiProperty } from '@nestjs/swagger';
import { Priority } from '../dto/create-todo.dto';

export class TodoEntity {
  @ApiProperty({
    description: 'The unique identifier of the todo',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The title of the todo',
    example: 'Buy groceries',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the todo',
    example: 'Get milk, bread, and eggs from the grocery store',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'Whether the todo is completed',
    example: false,
  })
  completed: boolean;

  @ApiProperty({
    description: 'The priority of the todo',
    enum: Priority,
    example: Priority.MEDIUM,
  })
  priority: Priority;

  @ApiProperty({
    description: 'The creation date of the todo',
    example: '2024-01-01T00:00:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The last update date of the todo',
    example: '2024-01-01T00:00:00Z',
  })
  updatedAt: Date;
}