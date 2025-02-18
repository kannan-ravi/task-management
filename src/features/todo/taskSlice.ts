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

      for (let i = 0; i < state.tasks.length; i++) {
        if (state.tasks[i].id === id) {
          state.tasks[i].status = status;
        }
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

    sortTasks: (
      state,
      action: PayloadAction<{ by: string; order: string }>
    ) => {
      const { by, order } = action.payload;

      state.tasks = state.tasks.sort((a, b) => {
        if (by === "due_date") {
          return order === "asc"
            ? new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
            : new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
        }
        return 0;
      });
    },

    reorderTasks: (
      state,
      action: PayloadAction<{
        fromIndex: number;
        toIndex: number;
        status: TaskStatus;
      }>
    ) => {
      const { fromIndex, toIndex, status } = action.payload;
      const tasks = state.tasks.filter((task) => task.status === status);

      if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

      // Swap the tasks within the same status
      const [movedTask] = tasks.splice(fromIndex, 1);
      tasks.splice(toIndex, 0, movedTask);

      // Update the state with new ordering
      state.tasks = state.tasks.map((task) =>
        task.status === status
          ? tasks.find((t) => t.id === task.id) || task
          : task
      );
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

  sortTasks,
  reorderTasks,

  changeCategoryFilter,
  changeDueDateFilter,
  changeSearchFilter,
} = TaskSlice.actions;

export default TaskSlice.reducer;
