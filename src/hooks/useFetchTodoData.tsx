import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { useGetTodoStatusTodoQuery } from "../services/supabaseApi";
import { useEffect } from "react";
import { addTask } from "../features/todo/taskSlice";
import { TaskStatus } from "../utils/types/types";

function useFetchTodoData({ todoStatus }: { todoStatus: TaskStatus }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useSelector((state: RootState) => state.task);

  const dispatch = useDispatch();
  const { data = [], isLoading } = useGetTodoStatusTodoQuery({
    userId: user?.id ?? "",
  });

  useEffect(() => {
    if (data.length > 0) {
      dispatch(addTask(data));
    }
  }, [data, dispatch]);

  const todos = tasks.filter((task) => task.status === todoStatus);
  return { todos, isLoading };
}

export default useFetchTodoData;
