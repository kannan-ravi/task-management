export type Todos = {
  id: string;
  title: string;
  date: string;
  status: string;
  category: string;
};

export type TaskStatus = "to-do" | "in-progress" | "completed";

export type TodoTableData = {
  id: TaskStatus;
  title: string;
  bgColor: string;
  data: Todos[];
};
