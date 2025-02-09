import { useDroppable } from "@dnd-kit/core";
import { Todos, TodoTableData } from "../../../utils/types";
import BoardTodoCard from "./BoardTodoCard";

type TodoSingleBoardProps = {
  todos: Todos[];
  header: TodoTableData;
};
function TodoSingleBoard({ todos, header }: TodoSingleBoardProps) {
  const { setNodeRef } = useDroppable({
    id: header.id,
  });
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
          <BoardTodoCard key={todo.id} todo={todo} />
        ))}
      </div>
    </div>
  );
}

export default TodoSingleBoard;
