import { FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import Checkbox from "../ui/Checkbox";
import { HiDotsHorizontal } from "react-icons/hi";
import { FaPencil } from "react-icons/fa6";
import { useEffect, useState } from "react";
import type { Todos } from "../../utils/types";

type ListViewTodoProps = {
  todo: Todos; // ✅ Accept single todo object
};

function ListViewTodo({ todo }: ListViewTodoProps) {
  const [moreOptions, setMoreOptions] = useState<boolean>(false);
  const [statusDropdown, setStatusDropdown] = useState<boolean>(false);
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

  return (
    <div className="lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:place-items-center bg-[#F1F1F1]">
      <div className="flex items-center gap-4 py-3 px-4 border-b border-[#0000001A] last:rounded-b-xl">
        <Checkbox />
        <FaCheckCircle className="text-[#A7A7A7] text-lg" />
        <p>{todo.title}</p>
      </div>
      <p className="hidden lg:text-sm lg:block">{todo.date}</p>
      <div className="hidden lg:block relative" id="status-dropdown">
        <p
          className="lg:bg-[#DDDADD] lg:px-3 lg:py-1 lg:rounded-sm lg:text-sm"
          onClick={() => setStatusDropdown(!statusDropdown)}
        >
          {todo.status}
        </p>
        {statusDropdown && (
          <div className="lg:bg-white lg:px-3 lg:py-1 lg:rounded-sm absolute top-7 z-10">
            <p className="hidden lg:text-sm lg:block lg:uppercase text-nowrap px-1 py-2 tracking-wider text-sm">
              to-do
            </p>
            <p className="hidden lg:text-sm lg:block lg:uppercase text-nowrap px-1 py-2 tracking-wider font-semibold text-sm">
              in-progress
            </p>
            <p className="hidden lg:text-sm lg:block lg:uppercase text-nowrap px-1 py-2 tracking-wider text-sm">
              completed
            </p>
          </div>
        )}
      </div>
      <p className="hidden lg:text-sm lg:block">{todo.category}</p>
      <div
        className="hidden lg:text-sm lg:block lg:justify-self-end lg:pe-4 relative"
        id="more-options-dropdown"
      >
        <HiDotsHorizontal onClick={() => setMoreOptions(!moreOptions)} />
        {moreOptions && (
          <div className="bg-white absolute top-5 right-5 shadow-lg rounded-lg z-10">
            <div className="lg:flex lg:items-center lg:px-3 lg:py-2 lg:gap-3 font-semibold">
              <FaPencil />
              Edit
            </div>
            <div className="lg:flex lg:items-center lg:px-3 lg:py-2 lg:gap-3 font-semibold text-red-500">
              <FaTrashAlt />
              Delete
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListViewTodo;
