import { IoIosArrowUp } from "react-icons/io";
import ListViewTodo from "./ListViewTodo";
import type {
  EditTaskType,
  TaskStatus,
  TodoTableData,
} from "../../../utils/types/types";
import { useDroppable } from "@dnd-kit/core";
import useFetchTodoData from "../../../hooks/useFetchTodoData";
import Loading from "../../ui/Loading";

type TodoTableprops = {
  header: TodoTableData;
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
  todoStatus: TaskStatus;
};

function TodoTable({
  header,
  setEditDrawer,
  todoStatus,
  setEditTask,
}: TodoTableprops) {
  const { setNodeRef } = useDroppable({
    id: header.id,
  });
  const { todos, isLoading } = useFetchTodoData(todoStatus);

  return (
    <div className="mb-10">
      <div
        className={`${header.bgColor} flex items-center justify-between px-4 py-3 rounded-t-xl`}
      >
        <h2 className="font-semibold">{header.title}</h2>
        <IoIosArrowUp className="text-2xl" />
      </div>
      <div
        ref={setNodeRef}
        className={`bg-gray-200 ${todos.length <= 0 ? "h-32" : ""}`}
      >
        {!isLoading && todos && todos.length > 0 ? (
          todos.map((item) => (
            <ListViewTodo
              key={item.id}
              todo={item}
              setEditDrawer={setEditDrawer}
              setEditTask={setEditTask}
            />
          ))
        ) : isLoading ? (
          <Loading />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500 text-normal">
              No Tasks in {header.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoTable;
