import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { useDraggable } from "@dnd-kit/core";
import { GetTodoTypes } from "../../../utils/types/service-types";
import { useDeleteTodo } from "../../../hooks/useDeleteTodo";
import toast from "react-hot-toast";
import { useLazyGetSingleTodoQuery } from "../../../services/supabaseApi";
import { EditTaskType } from "../../../utils/types/types";

type BoardTodoCardProps = {
  todo: GetTodoTypes;
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
};

function BoardTodoCard({
  todo,
  setEditDrawer,
  setEditTask,
}: BoardTodoCardProps) {
  const [cardMoreOptions, setCardMoreOptions] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (cardMoreOptions && !target.closest("#card-moreoptions-dropdown")) {
        setCardMoreOptions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [cardMoreOptions]);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: todo.id,
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const { handleDelete } = useDeleteTodo();
  const [fetchTodo] = useLazyGetSingleTodoQuery();

  const handleEdit = async () => {
    if (!todo?.id) {
      toast.error("Invalid todo data");
      return;
    }

    try {
      const refetchedData = await fetchTodo(todo.id).unwrap();
      setCardMoreOptions(false);
      setEditTask(refetchedData);
      setEditDrawer(true);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="bg-white rounded-lg p-4 h-32 flex flex-col justify-between"
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
    >
      <div
        className="flex items-center justify-between gap-3 relative"
        id="card-moreoptions-dropdown"
      >
        <h3 className="font-semibold">{todo.title}</h3>
        <HiDotsHorizontal onClick={() => setCardMoreOptions(true)} />

        <div
          className={`bg-white absolute top-5 right-0 shadow-lg rounded-lg z-10 transition-all duration-300 ${
            cardMoreOptions
              ? "opacity-100 scale-100 max-h-40"
              : "opacity-0 scale-95 max-h-0 overflow-hidden"
          }`}
        >
          <div
            className="lg:flex lg:items-center lg:px-3 lg:py-2 lg:gap-3 font-semibold lg:text-sm cursor-pointer"
            onClick={handleEdit}
          >
            <FaPencil />
            Edit
          </div>
          <div
            className="lg:flex lg:items-center lg:px-3 lg:py-2 lg:gap-3 font-semibold text-red-500  lg:text-sm cursor-pointer"
            onClick={() => handleDelete(todo.id)}
          >
            <FaTrashAlt />
            Delete
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 capitalize">{todo.category}</p>
        <p className="text-sm text-gray-500">{todo.due_date}</p>
      </div>
    </div>
  );
}

export default BoardTodoCard;
