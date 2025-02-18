import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useGetTodoStatusTodoQuery } from "../services/supabaseApi";
import { useEffect } from "react";
import { addTask, removeAllTask } from "../features/todo/taskSlice";

function useFetchTodoData() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { category_filter, tasks, due_date_filter, search_filter } =
    useSelector((state: RootState) => state.task);
  const dispatch = useDispatch();
  const {
    data = [],
    isLoading,
    refetch,
  } = useGetTodoStatusTodoQuery({
    userId: user?.id ?? "",
    category: category_filter,
    due_date: due_date_filter,
    search: search_filter,
  });

  useEffect(() => {
    if (data.length > 0) {
      dispatch(addTask(data));
    } else if (data.length === 0 && tasks.length > 0) {
      dispatch(removeAllTask());
    }
  }, [data, dispatch]);

  return { todos: data, isLoading, refetch };
}

export default useFetchTodoData;
