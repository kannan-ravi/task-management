import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import TodoSingleBoard from "./TodoSingleBoard";
import { TABLE_DATA } from "../../../utils/constants/table";
import { useDispatch } from "react-redux";
import { EditTaskType, TaskStatus } from "../../../utils/types/types";
import { updateStatus } from "../../../features/todo/taskSlice";
import { useUpdateTodoStatusMutation } from "../../../services/supabaseApi";
import toast from "react-hot-toast";

type BoardTodoProps = {
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
};
function BoardTodo({ setEditDrawer, isLoading, setEditTask }: BoardTodoProps) {
  const dispatch = useDispatch();
  const [updateTodoStatus] = useUpdateTodoStatusMutation();
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
    <div className="grid grid-cols-3 gap-6 container mx-auto px-4 my-10">
      <DndContext onDragEnd={handleDragEnd} sensors={[sensors]}>
        {TABLE_DATA.map((item) => (
          <TodoSingleBoard
            key={item.id}
            header={item}
            setEditDrawer={setEditDrawer}
            setEditTask={setEditTask}
            isLoading={isLoading}
          />
        ))}
      </DndContext>
    </div>
  );
}

export default BoardTodo;
