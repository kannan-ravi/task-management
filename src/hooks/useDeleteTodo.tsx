import { useDispatch } from "react-redux";

import toast from "react-hot-toast";
import { useDeleteTodoMutation } from "../services/supabaseApi";
import { deleteSingleTask } from "../features/todo/taskSlice";
import { TaskStatus } from "../utils/types/types";

export function useDeleteTodo() {
  const dispatch = useDispatch();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleDelete = async (id: number) => {
    if (!id) {
      toast.error("Invalid todo data");
      return;
    }

    try {
      const deleteTodoPromise = deleteTodo(id).unwrap();

      toast.promise(deleteTodoPromise, {
        loading: "Deleting todo...",
        success: "Todo deleted!",
        error: "Error deleting todo.",
      });

      const deletedTodo = await deleteTodoPromise;

      if (deletedTodo) {
        dispatch(deleteSingleTask({ id: deletedTodo[0].id }));
      }
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  return { handleDelete };
}
