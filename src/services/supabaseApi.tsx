import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabase";
import {
  CreateTodoType,
  GetTodoPropsTypes,
  GetTodoTypes,
  UpdateStatusPropsTypes,
} from "../utils/types/service-types";
import { TaskType } from "../features/todo/taskSlice";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getTodoStatusTodo: builder.query<GetTodoTypes[], GetTodoPropsTypes>({
      queryFn: async ({ userId, status }) => {
        const { data, error } = await supabase
          .from("todo")
          .select("*")
          .eq("user_id", userId)
          .eq("status", status);

        if (error) {
          return { error: { message: error.message } };
        }

        return { data: data || [] };
      },
    }),

    createTodo: builder.mutation<TaskType[], CreateTodoType>({
      queryFn: async (todo) => {
        const { data, error } = await supabase
          .from("todo")
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
          .from("todo")
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

    deleteTodo: builder.mutation({
      queryFn: async (id: number) => {
        const { data, error } = await supabase
          .from("todo")
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
} = supabaseApi;
