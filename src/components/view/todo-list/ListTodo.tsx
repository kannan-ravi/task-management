import TodoTable from "./TodoTable";
import type { TodoTableData, Todos } from "../../../utils/types";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";

type ListTodoType = {
  TABLE_DATA: TodoTableData[];
  todos: Todos[];
  setTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
};

function ListTodo({ TABLE_DATA, todos, setTodos }: ListTodoType) {
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as Todos["status"];

    setTodos(() =>
      todos.map((todo) =>
        todo.id === activeId ? { ...todo, status: overId } : todo
      )
    );
  }

  const sensors = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  } as const);
  return (
    <div className="mt-10">
      <div className="container px-4 mx-auto">
        <DndContext onDragEnd={handleDragEnd} sensors={[sensors]}>
          {TABLE_DATA.map((item) => (
            <TodoTable header={item} todos={item.data} key={item.id} />
          ))}
        </DndContext>
      </div>
    </div>
  );
}

export default ListTodo;
