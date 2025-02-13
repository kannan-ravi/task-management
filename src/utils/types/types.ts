export type TaskStatus = "todo" | "in_progress" | "completed";

export type TodoTableData = {
  id: TaskStatus;
  title: string;
  bgColor: string;
};
