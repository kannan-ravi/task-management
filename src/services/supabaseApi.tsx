import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabase";
import {
  CreateFileType,
  CreateFileTypeProps,
  CreateTodoType,
  EditTodoTypeProps,
  GetFilesTypes,
  GetTodoPropsTypes,
  GetTodoTypes,
  UpdateStatusPropsTypes,
} from "../utils/types/service-types";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getTodoStatusTodo: builder.query<GetTodoTypes[], GetTodoPropsTypes>({
      queryFn: async ({ userId, status }) => {
        const { data, error } = await supabase
          .from("todos")
          .select("*")
          .eq("user_id", userId)
          .eq("status", status);

        if (error) {
          return { error: { message: error.message } };
        }

        return { data: data || [] };
      },
    }),

    getSingleTodo: builder.query<getSingleTodoType, number>({
      queryFn: async (id) => {
        const { data: task, error: taskError } = await supabase
          .from("todos")
          .select("*")
          .eq("id", id)
          .single();

        if (taskError || !task) {
          return { error: { message: taskError?.message || "Task not found" } };
        }

        const { data: files, error: filesError } = await supabase
          .from("files")
          .select("*")
          .eq("task_id", id);

        if (filesError) {
          return { error: { message: filesError.message } };
        }

        return { data: { task: task, files: files || [] } };
      },
    }),

    createTodo: builder.mutation<GetTodoTypes[], CreateTodoType>({
      queryFn: async (todo) => {
        const { data, error } = await supabase
          .from("todos")
          .insert([todo])
          .select();
        if (error) {
          return { error };
        }

        return { data };
      },
    }),

    createFile: builder.mutation<CreateFileType, CreateFileTypeProps>({
      queryFn: async ({ task_id, files_url }) => {
        const { data, error } = await supabase
          .from("files")
          .insert([{ task_id, files_url }])
          .select("*")
          .single();

        if (error) {
          return { error: { message: error.message } };
        }

        return { data };
      },
    }),

    updateTodoStatus: builder.mutation<GetTodoTypes, UpdateStatusPropsTypes>({
      queryFn: async ({ status, id }) => {
        const { data, error } = await supabase
          .from("todos")
          .update({ status })
          .eq("id", id)
          .select("*")
          .single();

        if (error) {
          return { error: { message: error.message } };
        }

        return { data };
      },
    }),

    editTodo: builder.mutation<GetTodoTypes, EditTodoTypeProps>({
      queryFn: async (todo) => {
        const { data, error } = await supabase
          .from("todos")
          .update(todo)
          .eq("id", todo.id)
          .select("*")
          .single();

        if (error) {
          return { error: { message: error.message } };
        }

        return { data };
      },
    }),
    deleteTodo: builder.mutation({
      queryFn: async (id: number) => {
        const { data, error } = await supabase
          .from("todos")
          .delete()
          .eq("id", id)
          .select("id"); // Ensure it returns the deleted ID

        if (error) {
          return { error: { message: error.message } };
        }

        return { data };
      },
    }),
  }),
});

export const {
  useGetTodoStatusTodoQuery,
  useCreateTodoMutation,
  useUpdateTodoStatusMutation,
  useDeleteTodoMutation,
  useCreateFileMutation,
  useLazyGetSingleTodoQuery,
  useEditTodoMutation,
} = supabaseApi;

export type getSingleTodoType = {
  task: GetTodoTypes;
  files: GetFilesTypes[];
};
