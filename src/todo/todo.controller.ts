import { Body, Controller, Get, Param, Post, Redirect, Render } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get('/')
  @Render('index')
  index() {
    return {
      todos: this.todoService.list(),
      summary: this.todoService.summary()
    };
  }

  @Post('/todos')
  @Redirect('/')
  add(@Body('title') title: string) {
    this.todoService.add(title ?? '');
  }

  @Post('/todos/:id/toggle')
  @Redirect('/')
  toggle(@Param('id') id: string) {
    this.todoService.toggle(Number(id));
  }

  @Post('/todos/:id/delete')
  @Redirect('/')
  remove(@Param('id') id: string) {
    this.todoService.remove(Number(id));
  }
}
