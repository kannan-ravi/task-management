import { useDroppable } from "@dnd-kit/core";
import { EditTaskType, TodoTableData } from "../../../utils/types/types";
import BoardTodoCard from "./BoardTodoCard";
import Loading from "../../ui/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

type TodoSingleBoardProps = {
  header: TodoTableData;
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
};
function TodoSingleBoard({
  header,
  setEditDrawer,
  isLoading,
  setEditTask,
}: TodoSingleBoardProps) {
  const { setNodeRef } = useDroppable({
    id: header.id,
  });

  const { tasks } = useSelector((task: RootState) => task.task);
  const todosData = tasks.filter((task) => task.status === header.id);

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
          todosData.length <= 0 ? "h-32" : ""
        }`}
      >
        {!isLoading && todosData && todosData.length > 0 ? (
          todosData.map((todo) => (
            <BoardTodoCard
              key={todo.id}
              todo={todo}
              setEditDrawer={setEditDrawer}
              setEditTask={setEditTask}
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
