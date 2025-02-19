import { useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import {
  useBulkDeleteTodoMutation,
  useBulkStatusChangeMutation,
} from "../../services/supabaseApi";
import toast from "react-hot-toast";
import {
  bulkDeleteTask,
  bulkStatusChangeTask,
} from "../../features/todo/taskSlice";
import { useDispatch } from "react-redux";
import { TaskStatus } from "../../utils/types/types";
import useOutsideClick from "../../hooks/useOutsideClick";

type BulkActionBarProps = {
  showBulkAction: boolean;
  selectedTodo: number[];
  setSelectedTodo: React.Dispatch<React.SetStateAction<number[]>>;
};

function BulkActionBar({
  showBulkAction,
  selectedTodo,
  setSelectedTodo,
}: BulkActionBarProps) {
  const dispatch = useDispatch();
  const [builkStatusDropdown, setBuilkStatusDropdown] =
    useState<boolean>(false);

  const dropdownValues = [
    {
      id: "bulkaction-status-dropdown",
      state: builkStatusDropdown,
      setState: setBuilkStatusDropdown,
    },
  ];

  useOutsideClick(dropdownValues);

  const [bulkDeleteTodo] = useBulkDeleteTodoMutation();
  const [bulkStatusChange] = useBulkStatusChangeMutation();

  const handleBulkDelete = async () => {
    if (!selectedTodo.length) {
      toast.error("No todo selected");
      return;
    }

    try {
      const bulkDeletePromise = bulkDeleteTodo(selectedTodo).unwrap();

      toast.promise(bulkDeletePromise, {
        loading: "Deleting...",
        success: "Deleted successfully",
        error: "Failed to delete",
      });

      const deletedTodos = await bulkDeletePromise;

      if (deletedTodos) {
        dispatch(bulkDeleteTask(deletedTodos));
        setSelectedTodo([]);
      }
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  const handleBulkStatusChange = async (status: TaskStatus) => {
    if (!selectedTodo.length) {
      toast.error("No todo selected");
      return;
    }
    try {
      const bulkStatusChangePromise = bulkStatusChange({
        ids: selectedTodo,
        status: status,
      }).unwrap();

      toast.promise(bulkStatusChangePromise, {
        loading: "Updating...",
        success: "Updated successfully",
        error: "Failed to update",
      });

      const bulkStatusUpdatedTodos = await bulkStatusChangePromise;

      if (bulkStatusUpdatedTodos) {
        dispatch(
          bulkStatusChangeTask({ todos: bulkStatusUpdatedTodos, status })
        );
        setSelectedTodo([]);
        setBuilkStatusDropdown(false);
      }
    } catch (error) {
      console.error("Mutation failed:", error);
    }
  };

  return (
    <div
      className={`bg-black fixed left-[50%] translate-x-[-50%] rounded-2xl py-3 flex items-center justify-center px-4 gap-1 md:gap-3 duration-300 ${
        showBulkAction ? "bottom-6" : "-bottom-16"
      }`}
    >
      <div className="mx-auto border border-gray-500 flex items-center justify-start py-2 w-fit rounded-full gap-2 px-4 md:gap-3">
        <p className="text-white text-sm text-nowrap">
          {selectedTodo.length} Task Selected
        </p>
        <IoCloseSharp
          className="text-white"
          onClick={() => setSelectedTodo([])}
        />
      </div>

      <FaCheckSquare
        className="text-gray-200 text-xl"
        onClick={() => handleBulkStatusChange("completed")}
      />
      <div className="relative" id="bulkaction-status-dropdown">
        <button
          type="button"
          className="bg-black text-white px-4 py-1 rounded-full font-medium cursor-pointer border border-gray-500 text-sm"
          onClick={() => setBuilkStatusDropdown(!builkStatusDropdown)}
        >
          Status
        </button>

        <div
          className={`bg-black px-3 py-1 rounded-sm absolute bottom-11 right-0 z-10  duration-300 ${
            builkStatusDropdown
              ? "opacity-100 scale-100 max-h-32"
              : "opacity-0 scale-95 max-h-0 overflow-hidden"
          }`}
        >
          <p
            className="uppercase text-nowrap px-1 py-2 tracking-wider text-sm text-white"
            onClick={() => handleBulkStatusChange("todo")}
          >
            to-do
          </p>
          <p
            className="uppercase text-nowrap px-1 py-2 tracking-wider text-sm text-white"
            onClick={() => handleBulkStatusChange("in_progress")}
          >
            in-progress
          </p>
          <p
            className="uppercase text-nowrap px-1 py-2 tracking-wider text-sm text-white"
            onClick={() => handleBulkStatusChange("completed")}
          >
            completed
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleBulkDelete}
        className="bg-black text-red-700 px-4 py-1 rounded-full font-medium cursor-pointer border border-red-700 text-sm"
      >
        Delete
      </button>
    </div>
  );
}

export default BulkActionBar;
