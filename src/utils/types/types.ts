import React from "react";
import {
  GetActitvitesTypes,
  GetFilesTypes,
  GetTodoTypes,
} from "./service-types";

export type TaskStatus = "todo" | "in_progress" | "completed";

export type TodoTableData = {
  id: TaskStatus;
  title: string;
  bgColor: string;
};

export type EditTaskType = {
  task: GetTodoTypes;
  files: GetFilesTypes[];
  activities: GetActitvitesTypes[];
};

export type useOutsideClickProps = {
  id: string;
  state: boolean;
  setState: React.Dispatch<React.SetStateAction<boolean>>;
};
