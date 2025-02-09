import { IoIosArrowUp } from "react-icons/io";
import ListViewTodo from "./ListViewTodo";
import type { Todos, TodoTableData } from "../../../utils/types";
import { useDroppable } from "@dnd-kit/core";

type TodoTableprops = {
  todos: Todos[];
  header: TodoTableData;
};

function TodoTable({ todos, header }: TodoTableprops) {
  const { setNodeRef } = useDroppable({
    id: header.id,
  });
  return (
    <div className="mb-10">
      <div
        className={`${header.bgColor} flex items-center justify-between px-4 py-3 rounded-t-xl`}
      >
        <h2 className="font-semibold">{header.title}</h2>
        <IoIosArrowUp className="text-2xl" />
      </div>
      <div
        ref={setNodeRef}
        className={`bg-gray-200 ${todos.length <= 0 ? "h-32" : ""}`}
      >
        {todos.map((item) => (
          <ListViewTodo key={item.id} todo={item} />
        ))}
      </div>
    </div>
  );
}

export default TodoTable;
