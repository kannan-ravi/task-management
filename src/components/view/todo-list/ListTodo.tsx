import TodoTable from "./TodoTable";
import type { EditTaskType, TaskStatus } from "../../../utils/types/types";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import { TABLE_DATA } from "../../../utils/constants/table";
import {
  useCreateActivitiesMutation,
  useUpdateTodoStatusMutation,
} from "../../../services/supabaseApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { reorderTasks, sortTasks, updateStatus } from "../../../features/todo/taskSlice";
import { CreateActivitiesProps } from "../../../utils/types/service-types";
import { FaSort } from "react-icons/fa";
import { useState } from "react";

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
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [updateTodoStatus] = useUpdateTodoStatusMutation();
  const [createActivities] = useCreateActivitiesMutation();
  const dispatch = useDispatch();
  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const todoId = Number(activeId.split("--")[0]) as number;
    const oldStatus = activeId.split("--")[1] as TaskStatus;
    const newStatus = over.id as TaskStatus;

    if(oldStatus === newStatus) {
      dispatch(reorderTasks({ taskId: todoId, status: newStatus, newIndex: over.data.current?.sortable.index }));
    }

    dispatch(
      updateStatus({
        id: todoId,
        status: newStatus,
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
        const activities: CreateActivitiesProps = {
          task_id: todoId,
          action: "status-changed",
          details: {
            field: "status",
            old_value: oldStatus,
            new_value: newStatus,
          },
        };

        await createActivities(activities).unwrap();
      } else {
        dispatch(
          updateStatus({
            id: todoId,
            status: oldStatus,
          })
        );
      }
    } catch (error) {
      dispatch(
        updateStatus({
          id: todoId,
          status: oldStatus,
        })
      );
      console.error("Mutation failed:", error);
    }
  }

  const handleSort = (by: string) => {
    if (sortOrder === "asc") {
      setSortOrder("desc");
      dispatch(sortTasks({ by: by, order: sortOrder }));
    } else {
      setSortOrder("asc");
      dispatch(sortTasks({ by: by, order: sortOrder }));
    }
  };

  const sensors = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 3,
    },
  } as const);

  return (
    <div className="mt-10">
      <div className="container px-4 mx-auto">
        <div className="hidden lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:py-2 lg:border-t-2 lg:border-gray-200">
          <p className="lg:text-sm font-semibold">Task Name</p>
          <p
            className="lg:text-sm font-semibold lg:flex lg:items-center lg:gap-2"
            onClick={() => handleSort("due_date")}
          >
            Due on <FaSort className="text-gray-400" />
          </p>
          <p className="lg:text-sm font-semibold">Task Status</p>
          <p className="lg:text-sm font-semibold">Task Category</p>
        </div>
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
