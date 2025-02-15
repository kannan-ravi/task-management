import { GetFilesTypes, GetTodoTypes } from "./service-types";

export type TaskStatus = "todo" | "in_progress" | "completed";

export type TodoTableData = {
  id: TaskStatus;
  title: string;
  bgColor: string;
};

export type EditTaskType = {
  task: GetTodoTypes;
  files: GetFilesTypes[];
};
