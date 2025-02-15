import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabase";
import {
  CreateFileType,
  CreateFileTypeProps,
  CreateTodoType,
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
} = supabaseApi;
