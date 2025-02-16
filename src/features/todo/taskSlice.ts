import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TaskStatus } from "../../utils/types/types";
import { BulkActionType, GetTodoTypes } from "../../utils/types/service-types";

export type TaskSliceType = {
  todo: GetTodoTypes[];
  in_progress: GetTodoTypes[];
  completed: GetTodoTypes[];
};

export type BulkEditTaskType = {
  todos: BulkActionType[];
  status: TaskStatus;
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

    createNewTask: (
      state,
      action: PayloadAction<{ todo: GetTodoTypes[]; status: TaskStatus }>
    ) => {
      const { todo, status } = action.payload;
      state[status].push(todo[0]);
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

    editTodoTask: (
      state,
      action: PayloadAction<{
        todo: GetTodoTypes;
        id: number;
      }>
    ) => {
      const { todo, id } = action.payload;

      Object.keys(state).forEach((key) => {
        state[key as TaskStatus] = state[key as TaskStatus].filter(
          (task) => task.id !== id
        );
      });

      state[todo.status].push(todo);
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

    bulkDeleteTask: (state, action: PayloadAction<BulkActionType[]>) => {
      const idsToDelete = action.payload.map((task) => task.id);

      state.todo = state.todo.filter((task) => !idsToDelete.includes(task.id));
      state.in_progress = state.in_progress.filter(
        (task) => !idsToDelete.includes(task.id)
      );
      state.completed = state.completed.filter(
        (task) => !idsToDelete.includes(task.id)
      );
    },

    bulkStatusChangeTask: (state, action: PayloadAction<BulkEditTaskType>) => {
      const { todos, status } = action.payload;
      todos.forEach((todo) => {
        let findTodoIndex = state.todo.findIndex((task) => task.id === todo.id);
        if (findTodoIndex > -1) {
          state.todo[findTodoIndex].status = status;
          const finalTodo = state.todo.splice(findTodoIndex, 1)[0];
          state[status].push(finalTodo);
        }

        let findProgressIndex = state.in_progress.findIndex(
          (task) => task.id === todo.id
        );
        if (findProgressIndex > -1) {
          state.in_progress[findProgressIndex].status = status;
          const finalTodo = state.in_progress.splice(findProgressIndex, 1)[0];
          state[status].push(finalTodo);
        }

        let findCompletedIndex = state.completed.findIndex(
          (task) => task.id === todo.id
        );
        if (findCompletedIndex > -1) {
          state.completed[findCompletedIndex].status = status;
          const finalTodo = state.completed.splice(findCompletedIndex, 1)[0];
          state[status].push(finalTodo);
        }
      });
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
  createNewTask,
  updateStatus,
  editTodoTask,
  removeAllTask,
  deleteSingleTask,
  bulkDeleteTask,
  bulkStatusChangeTask,
} = TaskSlice.actions;

export default TaskSlice.reducer;
