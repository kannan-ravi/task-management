import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { TaskStatus } from "../utils/types/types";
import { useGetTodoStatusTodoQuery } from "../services/supabaseApi";
import { useEffect } from "react";
import { addTask } from "../features/todo/taskSlice";

function useFetchTodoData(todoStatus: TaskStatus) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { todo, in_progress, completed } = useSelector(
    (state: RootState) => state.task
  );

  const todos =
    todoStatus === "todo"
      ? todo
      : todoStatus === "in_progress"
      ? in_progress
      : completed;

  const dispatch = useDispatch();
  const { data = [], isLoading } = useGetTodoStatusTodoQuery({
    userId: user?.id ?? "",
    status: todoStatus,
  });

  useEffect(() => {
    if (data.length > 0) {
      dispatch(addTask({ todos: data, status: todoStatus }));
    }
  }, [data, dispatch, todoStatus]);

  return { todos, isLoading };
}

export default useFetchTodoData;
