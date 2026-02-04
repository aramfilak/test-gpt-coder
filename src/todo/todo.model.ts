export type TodoStatus = 'pending' | 'done';

export interface Todo {
  id: number;
  title: string;
  status: TodoStatus;
  createdAt: Date;
}
