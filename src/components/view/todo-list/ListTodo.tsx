import TodoTable from "./TodoTable";
import type { EditTaskType, TaskStatus } from "../../../utils/types/types";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { TABLE_DATA } from "../../../utils/constants/table";
import { useUpdateTodoStatusMutation } from "../../../services/supabaseApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { updateStatus } from "../../../features/todo/taskSlice";

type ListTodoType = {
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
  selectedTodo: number[];
  setSelectedTodo: React.Dispatch<React.SetStateAction<number[]>>;
};

function ListTodo({
  setEditDrawer,
  setEditTask,
  selectedTodo,
  setSelectedTodo,
}: ListTodoType) {
  const [updateTodoStatus] = useUpdateTodoStatusMutation();
  const dispatch = useDispatch();
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const todoId = Number(activeId.split("--")[0]) as number;
    const oldStatus = activeId.split("--")[1] as TaskStatus;
    const newStatus = over.id as TaskStatus;

    dispatch(
      updateStatus({
        id: todoId,
        newStatus: newStatus,
      })
    );
    try {
      const updatePromise = updateTodoStatus({
        status: newStatus,
        id: todoId,
      }).unwrap();

      toast.promise(updatePromise, {
        loading: "Updating...",
        success: "Updated Successfully...",
        error: "Error while updating...",
      });

      const updatedTodo = await updatePromise;
      if (updatedTodo) {
      } else {
        dispatch(
          updateStatus({
            id: todoId,
            newStatus: oldStatus,
          })
        );
      }
    } catch (error) {
      dispatch(
        updateStatus({
          id: todoId,
          newStatus: oldStatus,
        })
      );
      console.error("Mutation failed:", error);
    }
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
              setEditTask={setEditTask}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}

export default ListTodo;
