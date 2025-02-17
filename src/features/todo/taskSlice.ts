import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TaskStatus } from "../../utils/types/types";
import { BulkActionType, GetTodoTypes } from "../../utils/types/service-types";

export type TaskSliceType = {
  tasks: GetTodoTypes[];
  category_filter: string;
  due_date_filter: string;
  search_filter: string;
};

export type BulkEditTaskType = {
  todos: BulkActionType[];
  status: TaskStatus;
};

const initialState: TaskSliceType = {
  tasks: [],
  category_filter: "",
  due_date_filter: "",
  search_filter: "",
};

export const TaskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<GetTodoTypes[]>) => {
      const todos = action.payload;
      state.tasks = todos;
    },

    createNewTask: (state, action: PayloadAction<GetTodoTypes[]>) => {
      const todo = action.payload;
      state.tasks.push(todo[0]);
    },

    updateStatus: (
      state,
      action: PayloadAction<{
        id: number;
        status: TaskStatus;
      }>
    ) => {
      const { id, status } = action.payload;

      state.tasks = state.tasks.map((task) => {
        if (task.id === id) {
          task.status = status;
        }
        return task;
      });
    },

    editTodoTask: (
      state,
      action: PayloadAction<{
        todo: GetTodoTypes;
        id: number;
      }>
    ) => {
      const { todo, id } = action.payload;

      const taskIndex = state.tasks.findIndex((task) => task.id === id);
      if (taskIndex > -1) {
        state.tasks[taskIndex] = todo;
      }
    },

    deleteSingleTask: (state, action: PayloadAction<{ id: number }>) => {
      const { id } = action.payload;
      state.tasks = state.tasks.filter((task) => task.id !== id);
    },

    bulkDeleteTask: (state, action: PayloadAction<BulkActionType[]>) => {
      const idsToDelete = action.payload.map((task) => task.id);

      state.tasks = state.tasks.filter(
        (task) => !idsToDelete.includes(task.id)
      );
    },

    bulkStatusChangeTask: (state, action: PayloadAction<BulkEditTaskType>) => {
      const { todos, status } = action.payload;

      state.tasks = state.tasks.map((task) => {
        if (todos.some((todo) => todo.id === task.id)) {
          task.status = status;
        }
        return task;
      });
    },

    removeAllTask: (state) => {
      state.tasks = [];
    },

    removeAllFilter: (state) => {
      state.category_filter = "";
      state.due_date_filter = "";
    },

    changeCategoryFilter: (state, action: PayloadAction<string>) => {
      state.category_filter = action.payload;
    },

    changeDueDateFilter: (state, action: PayloadAction<string>) => {
      state.due_date_filter = action.payload;
    },

    changeSearchFilter: (state, action: PayloadAction<string>) => {
      state.search_filter = action.payload;
    },
  },
});

export const {
  addTask,
  createNewTask,
  updateStatus,
  editTodoTask,
  removeAllTask,
  removeAllFilter,
  deleteSingleTask,
  bulkDeleteTask,
  bulkStatusChangeTask,

  changeCategoryFilter,
  changeDueDateFilter,
  changeSearchFilter,
} = TaskSlice.actions;

export default TaskSlice.reducer;
