import TodoTable from "./TodoTable";
import type { TodoTableData } from "../../../utils/types/types";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";

type ListTodoType = {
  TABLE_DATA: TodoTableData[];
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

function ListTodo({ TABLE_DATA, setEditDrawer }: ListTodoType) {
  function handleDragEnd(event: DragEndEvent) {
    // const { active, over } = event;
    console.log(event);
    // if (!over) return;

    // const activeId = active.id as string;
    // const overId = over.id as Todos["status"];
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
            <TodoTable
              header={item}
              todoStatus={item.id}
              key={item.id}
              setEditDrawer={setEditDrawer}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}

export default ListTodo;
