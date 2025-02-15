import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import Checkbox from "../../ui/Checkbox";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useState } from "react";
import type { GetTodoTypes } from "../../../utils/types/service-types";
import { MdDragIndicator } from "react-icons/md";
import { useDraggable } from "@dnd-kit/core";
import {
  useDeleteTodoMutation,
  useUpdateTodoStatusMutation,
} from "../../../services/supabaseApi";
import { useDispatch } from "react-redux";
import {
  deleteSingleTask,
  updateStatus,
} from "../../../features/todo/taskSlice";
import toast from "react-hot-toast";
import { TaskStatus } from "../../../utils/types/types";

type ListViewTodoProps = {
  todo: GetTodoTypes;
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

function ListViewTodo({ todo, setEditDrawer }: ListViewTodoProps) {
  const [moreOptions, setMoreOptions] = useState<boolean>(false);
  const [statusDropdown, setStatusDropdown] = useState<boolean>(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (moreOptions && !target.closest("#more-options-dropdown")) {
        setMoreOptions(false);
      }
      if (statusDropdown && !target.closest("#status-dropdown")) {
        setStatusDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [moreOptions, statusDropdown]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: todo.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const [updateTodoStatus] = useUpdateTodoStatusMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleChangeStatus = async (status: TaskStatus) => {
    if (!todo?.id || !status) {
      toast.error("Invalid todo data");
      return;
    }

    try {
      const updatePromise = updateTodoStatus({
        status: status,
        id: todo.id,
      }).unwrap();

      toast.promise(updatePromise, {
        loading: "Updating todo status...",
        success: "Todo status updated!",
        error: "Error updating todo status.",
      });

      const updatedTodo = await updatePromise;
      if (updatedTodo) {
        dispatch(
          updateStatus({
            id: todo.id,
            oldStatus: todo.status,
            newStatus: updatedTodo.status,
          })
        );
      }
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!todo?.id) {
      toast.error("Invalid todo data");
      return;
    }

    try {
      const deleteTodoPromise = deleteTodo(id).unwrap();

      toast.promise(deleteTodoPromise, {
        loading: "Deleting todo...",
        success: "Todo deleted!",
        error: "Error deleting todo status.",
      });

      const deletedTodo = await deleteTodoPromise;

      if (deletedTodo) {
        dispatch(
          deleteSingleTask({ id: deletedTodo[0].id, status: todo.status })
        );
      }
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  return (
    <div
      className="lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-[#F1F1F1]"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <div className="flex items-center gap-4 py-3 px-4 border-b border-[#0000001A] last:rounded-b-xl">
        <Checkbox />
        <FaCheckCircle className="text-[#A7A7A7] text-lg" />
        <MdDragIndicator className="text-[#A7A7A7] text-lg hidden lg:block" />
        <p>{todo.title}</p>
      </div>
      <p className="hidden lg:text-sm lg:block lg:self-center">
        {new Date(todo.due_date).toLocaleString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}
      </p>
      <div
        className="hidden lg:flex lg:items-center lg:relative"
        id="status-dropdown"
      >
        <p
          className="lg:bg-[#DDDADD] lg:px-3 lg:py-1 lg:rounded-sm lg:text-sm lg:self-center lg:w-fit cursor-pointer lg:uppercase"
          onClick={() => setStatusDropdown(!statusDropdown)}
        >
          {todo.status}
        </p>

        <div
          className={`lg:bg-white lg:px-3 lg:rounded-sm absolute top-14 xl:top-10 z-10 transition-all duration-300 
          ${
            statusDropdown
              ? "opacity-100 scale-100 max-h-32"
              : "opacity-0 scale-95 max-h-0 overflow-hidden"
          }`}
        >
          <p
            onClick={() => handleChangeStatus("todo")}
            className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer 
            ${todo.status === "todo" ? "font-semibold" : ""}`}
          >
            to-do
          </p>
          <p
            onClick={() => handleChangeStatus("in_progress")}
            className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer 
            ${todo.status === "in_progress" ? "font-semibold" : ""}`}
          >
            in-progress
          </p>
          <p
            onClick={() => handleChangeStatus("completed")}
            className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer 
            ${todo.status === "completed" ? "font-semibold" : ""}`}
          >
            completed
          </p>
        </div>
      </div>
      <p className="hidden lg:text-sm lg:block lg:self-center capitalize">
        {todo.category}
      </p>

      <div
        className="hidden lg:text-sm lg:block lg:justify-self-end lg:self-center lg:pe-4 relative"
        id="more-options-dropdown"
      >
        <HiDotsHorizontal
          className="cursor-pointer"
          onClick={() => setMoreOptions(!moreOptions)}
        />
        <div
          className={`bg-white absolute top-5 right-5 shadow-lg rounded-lg z-10 transition-all duration-300 
      ${
        moreOptions
          ? "opacity-100 scale-100 max-h-40"
          : "opacity-0 scale-95 max-h-0 overflow-hidden"
      }`}
        >
          <div
            className="lg:flex lg:items-center lg:px-3 lg:py-2 lg:gap-3 font-semibold cursor-pointer"
            onClick={() => setEditDrawer(true)}
          >
            <FaPencil />
            Edit
          </div>
          <div
            className="lg:flex lg:items-center lg:px-3 lg:py-2 lg:gap-3 font-semibold text-red-500"
            onClick={() => handleDelete(todo.id)}
          >
            <FaTrashAlt />
            Delete
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListViewTodo;
