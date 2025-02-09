import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { Todos, TodoTableData } from "../../../utils/types";
import TodoSingleBoard from "./TodoSingleBoard";

type BoardTodoProps = {
  TABLE_DATA: TodoTableData[];
  todos: Todos[];
  setTodos: React.Dispatch<React.SetStateAction<Todos[]>>;
};
function BoardTodo({ TABLE_DATA, todos, setTodos }: BoardTodoProps) {
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
    <div className="grid grid-cols-3 gap-6 container mx-auto px-4 my-10">
      <DndContext onDragEnd={handleDragEnd} sensors={[sensors]}>
        {TABLE_DATA.map((item) => (
          <TodoSingleBoard key={item.id} header={item} todos={item.data} />
        ))}
      </DndContext>
    </div>
  );
}

export default BoardTodo;
