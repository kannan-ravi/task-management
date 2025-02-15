import { TaskStatus } from "./types";

export type CreateTodoType = {
  user_id: string | undefined;
  title: string;
  description: string;
  due_date: string;
  category: string;
  status: TaskStatus;
};

export type CreateFileType = {
  task_id: number;
  files_url: string;
  file_type: string;
  created_at: string;
  updated_at: string;
};

export type CreateFileTypeProps = {
  task_id: number;
  files_url: string[];
};

export type GetTodoTypes = {
  id: number;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  due_date: string;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
};

export type GetTodoPropsTypes = {
  userId: string;
  status: string;
};

export type UpdateStatusPropsTypes = { status: TaskStatus; id: number };
