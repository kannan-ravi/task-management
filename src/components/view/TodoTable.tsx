import { IoIosArrowUp } from "react-icons/io";
import ListViewTodo from "./ListViewTodo";
import type { Todos } from "../../utils/types";

type TodoTableprops = {
  headerColor?: string;
  todos: Todos[];
};

function TodoTable({ headerColor, todos }: TodoTableprops) {
  return (
    <div className="mb-10">
      <div
        className={`${headerColor} flex items-center justify-between px-4 py-3 rounded-t-xl`}
      >
        <h2 className="font-semibold">Todo (3)</h2>
        <IoIosArrowUp className="text-2xl" />
      </div>

      <div>
        {todos.map((item) => (
          <ListViewTodo key={item.id} todo={item} />
        ))}
      </div>
    </div>
  );
}

export default TodoTable;
