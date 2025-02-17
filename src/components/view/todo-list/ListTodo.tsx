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
  isLoading: boolean;
};

function ListTodo({
  setEditDrawer,
  setEditTask,
  selectedTodo,
  setSelectedTodo,
  isLoading,
}: ListTodoType) {
  const [updateTodoStatus] = useUpdateTodoStatusMutation();
  const dispatch = useDispatch();
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const todoId = active.id as number;
    const status = over.id as TaskStatus;

    dispatch(
      updateStatus({
        id: todoId,
        status: status,
      })
    );
    try {
      const updatePromise = updateTodoStatus({
        status: status,
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
            status: status,
          })
        );
      }
    } catch (error) {
      dispatch(
        updateStatus({
          id: todoId,
          status: status,
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
              key={item.id}
              setEditDrawer={setEditDrawer}
              setEditTask={setEditTask}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
              isLoading={isLoading}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
}

export default ListTodo;
