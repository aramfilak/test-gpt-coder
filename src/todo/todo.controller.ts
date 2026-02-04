import { Body, Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { TodoService } from './todo.service';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  index(@Res() response: Response) {
    return response.sendFile(join(__dirname, '..', '..', 'public', 'index.html'));
  }

  @Get('/api/todos')
  list() {
    return {
      todos: this.todoService.list(),
      summary: this.todoService.summary()
    };
  }

  @Post('/api/todos')
  add(@Body('title') title: string) {
    this.todoService.add(title ?? '');
    return { ok: true };
  }

  @Post('/api/todos/:id/toggle')
  toggle(@Param('id') id: string) {
    this.todoService.toggle(Number(id));
    return { ok: true };
  }

  @Delete('/api/todos/:id')
  remove(@Param('id') id: string) {
    this.todoService.remove(Number(id));
    return { ok: true };
  }
}
