import { Injectable } from '@nestjs/common';
import { Todo } from './todo.model';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    {
      id: 1,
      title: 'Try the NestJS Todo app',
      status: 'pending',
      createdAt: new Date()
    }
  ];
  private nextId = 2;

  list(): Todo[] {
    return [...this.todos].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  add(title: string): void {
    const trimmed = title.trim();
    if (!trimmed) {
      return;
    }

    this.todos.unshift({
      id: this.nextId++,
      title: trimmed,
      status: 'pending',
      createdAt: new Date()
    });
  }

  toggle(id: number): void {
    const todo = this.todos.find((item) => item.id === id);
    if (!todo) {
      return;
    }

    todo.status = todo.status === 'done' ? 'pending' : 'done';
  }

  remove(id: number): void {
    this.todos = this.todos.filter((item) => item.id !== id);
  }

  summary() {
    const total = this.todos.length;
    const completed = this.todos.filter((todo) => todo.status === 'done').length;
    return {
      total,
      completed,
      remaining: total - completed
    };
  }
}
