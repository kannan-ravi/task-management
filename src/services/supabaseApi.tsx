import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import supabase from "../supabase";
import {
  BulkActionType,
  CreateActivitiesProps,
  CreateFileType,
  CreateFileTypeProps,
  CreateTodoType,
  EditTodoTypeProps,
  GetActitvitesTypes,
  GetFilesTypes,
  GetTodoPropsTypes,
  GetTodoTypes,
  UpdateStatusPropsTypes,
} from "../utils/types/service-types";
import { TaskStatus } from "../utils/types/types";

export const supabaseApi = createApi({
  reducerPath: "supabaseApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getTodoStatusTodo: builder.query<GetTodoTypes[], GetTodoPropsTypes>({
      queryFn: async ({ userId, category, due_date, search }) => {
        let query = supabase.from("todos").select("*").eq("user_id", userId);

        if (category) {
          query = query.eq("category", category);
        }

        if (due_date) {
          query = query
            .gte("due_date", `${due_date} 00:00:00`)
            .lte("due_date", `${due_date} 23:59:59`);
        }

        if (search) {
          query = query.ilike("title", `%${search}%`);
        }

        const { data, error } = await query;

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

        const { data: activities, error: activitiesError } = await supabase
          .from("activities")
          .select("*")
          .eq("task_id", id)
          .order("created_at", { ascending: true });

        if (activitiesError) {
          return { error: { message: activitiesError.message } };
        }

        return { data: { task: task, files: files || [], activities } };
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

    createActivities: builder.mutation<
      GetActitvitesTypes[],
      CreateActivitiesProps
    >({
      queryFn: async (activity) => {
        const { data, error } = await supabase
          .from("activities")
          .insert([activity])
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
          .select("id");

        if (error) {
          return { error: { message: error.message } };
        }

        return { data };
      },
    }),
    bulkDeleteTodo: builder.mutation<BulkActionType[], number[]>({
      queryFn: async (ids) => {
        const { data, error } = await supabase
          .from("todos")
          .delete()
          .in("id", ids)
          .select("id");

        if (error) {
          return { error: { message: error.message } };
        }

        return { data };
      },
    }),
    bulkStatusChange: builder.mutation<BulkActionType[], BulkStatusChangeProps>(
      {
        queryFn: async ({ ids, status }) => {
          const { data, error } = await supabase
            .from("todos")
            .update({ status })
            .in("id", ids)
            .select("id");

          if (error) {
            return { error: { message: error.message } };
          }

          return { data };
        },
      }
    ),
  }),
});

export const {
  useGetTodoStatusTodoQuery,
  useLazyGetSingleTodoQuery,
  useCreateTodoMutation,
  useCreateActivitiesMutation,
  useCreateFileMutation,
  useUpdateTodoStatusMutation,
  useDeleteTodoMutation,
  useEditTodoMutation,
  useBulkDeleteTodoMutation,
  useBulkStatusChangeMutation,
} = supabaseApi;

export type getSingleTodoType = {
  task: GetTodoTypes;
  files: GetFilesTypes[];
  activities: GetActitvitesTypes[];
};

export type BulkStatusChangeProps = {
  ids: number[];
  status: TaskStatus;
};
