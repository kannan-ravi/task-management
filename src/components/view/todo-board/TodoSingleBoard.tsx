import { useDroppable } from "@dnd-kit/core";
import { TodoTableData } from "../../../utils/types/types";
import BoardTodoCard from "./BoardTodoCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useGetTodoStatusTodoQuery } from "../../../services/supabaseApi";
import { useEffect } from "react";
import { addTask } from "../../../features/todo/taskSlice";

type TodoSingleBoardProps = {
  header: TodoTableData;
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  todoStatus: string;
};
function TodoSingleBoard({
  header,
  setEditDrawer,
  todoStatus,
}: TodoSingleBoardProps) {
  const { setNodeRef } = useDroppable({
    id: header.id,
  });

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
  const { data = [] } = useGetTodoStatusTodoQuery({
    userId: user?.id ?? "",
    status: todoStatus,
  });

  useEffect(() => {
    if (data.length > 0) {
      dispatch(addTask({ todos: data, status: todoStatus }));
    }
  }, [data, dispatch, todoStatus]);
  return (
    <div className="p-4 bg-[#F1F1F1] rounded-2xl" ref={setNodeRef}>
      <div className="flex items-center gap-2">
        <h2
          className={`tracking-wide uppercase font-semibold px-2 py-1 rounded-sm ${header.bgColor}`}
        >
          {header.title}
        </h2>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {todos.map((todo) => (
          <BoardTodoCard
            key={todo.id}
            todo={todo}
            setEditDrawer={setEditDrawer}
          />
        ))}
      </div>
    </div>
  );
}

export default TodoSingleBoard;
