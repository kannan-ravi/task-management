import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TaskStatus } from "../../utils/types/types";
import { GetTodoTypes } from "../../utils/types/service-types";

export type TaskSliceType = {
  todo: GetTodoTypes[];
  in_progress: GetTodoTypes[];
  completed: GetTodoTypes[];
};

const initialState: TaskSliceType = {
  todo: [],
  in_progress: [],
  completed: [],
};

export const TaskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (
      state,
      action: PayloadAction<{ todos: GetTodoTypes[]; status: string }>
    ) => {
      if (action.payload.status === "todo") {
        state.todo = action.payload.todos;
      } else if (action.payload.status === "in_progress") {
        state.in_progress = action.payload.todos;
      } else if (action.payload.status === "completed") {
        state.completed = action.payload.todos;
      }
    },

    updateStatus: (
      state,
      action: PayloadAction<{
        id: number;
        oldStatus: TaskStatus;
        newStatus: TaskStatus;
      }>
    ) => {
      const { id, oldStatus, newStatus } = action.payload;
      const todoIndex = state[oldStatus].findIndex((todo) => todo.id === id);
      if (todoIndex > -1) {
        const todo = state[oldStatus].splice(todoIndex, 1)[0];
        todo.status = newStatus;
        state[newStatus].push(todo);
      }
    },

    createNewTask: (
      state,
      action: PayloadAction<{ todo: GetTodoTypes[]; status: TaskStatus }>
    ) => {
      const { todo, status } = action.payload;
      state[status].push(todo[0]);
    },

    deleteSingleTask: (
      state,
      action: PayloadAction<{ id: number; status: TaskStatus }>
    ) => {
      const { id, status } = action.payload;

      const taskIndex = state[status].findIndex((task) => task.id === id);
      if (taskIndex > -1) {
        state[status].splice(taskIndex, 1);
      }
    },
    removeAllTask: (state) => {
      state.todo = [];
      state.in_progress = [];
      state.completed = [];
    },
  },
});

export const {
  addTask,
  updateStatus,
  createNewTask,
  removeAllTask,
  deleteSingleTask,
} = TaskSlice.actions;

export default TaskSlice.reducer;
