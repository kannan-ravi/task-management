import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { TodoTableData } from "../../../utils/types/types";
import TodoSingleBoard from "./TodoSingleBoard";

type BoardTodoProps = {
  TABLE_DATA: TodoTableData[];
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};
function BoardTodo({ TABLE_DATA, setEditDrawer }: BoardTodoProps) {
  function handleDragEnd(event: DragEndEvent) {
    // const { active, over } = event;

    // if (!over) return;

    // const activeId = active.id as string;
    // const overId = over.id as Todos["status"];

    console.log(event);
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
          <TodoSingleBoard
            key={item.id}
            header={item}
            todoStatus={item.id}
            setEditDrawer={setEditDrawer}
          />
        ))}
      </DndContext>
    </div>
  );
}

export default BoardTodo;
