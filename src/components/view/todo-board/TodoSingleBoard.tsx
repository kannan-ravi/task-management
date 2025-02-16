import { useDroppable } from "@dnd-kit/core";
import { TaskStatus, TodoTableData } from "../../../utils/types/types";
import BoardTodoCard from "./BoardTodoCard";
import { useEffect } from "react";
import { addTask } from "../../../features/todo/taskSlice";
import useFetchTodoData from "../../../hooks/useFetchTodoData";
import Loading from "../../ui/Loading";

type TodoSingleBoardProps = {
  header: TodoTableData;
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  todoStatus: TaskStatus;
};
function TodoSingleBoard({
  header,
  setEditDrawer,
  todoStatus,
}: TodoSingleBoardProps) {
  const { setNodeRef } = useDroppable({
    id: header.id,
  });

  const { todos, isLoading } = useFetchTodoData(todoStatus);

  return (
    <div className="p-4 bg-[#F1F1F1] rounded-2xl" ref={setNodeRef}>
      <div className="flex items-center gap-2">
        <h2
          className={`tracking-wide uppercase font-semibold px-2 py-1 rounded-sm ${header.bgColor}`}
        >
          {header.title}
        </h2>
      </div>

      <div
        className={`mt-4 flex flex-col gap-4 ${
          todos.length <= 0 ? "h-32" : ""
        }`}
      >
        {!isLoading && todos && todos.length > 0 ? (
          todos.map((todo) => (
            <BoardTodoCard
              key={todo.id}
              todo={todo}
              setEditDrawer={setEditDrawer}
            />
          ))
        ) : isLoading ? (
          <Loading />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500 text-normal">
              No Tasks in {header.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoSingleBoard;
