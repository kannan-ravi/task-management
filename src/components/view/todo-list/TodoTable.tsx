import { IoIosArrowUp } from "react-icons/io";
import ListViewTodo from "./ListViewTodo";
import type { EditTaskType, TodoTableData } from "../../../utils/types/types";
import { useDroppable } from "@dnd-kit/core";
import Loading from "../../ui/Loading";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import QuickTaskCreateForm from "./QuickTaskCreateForm";

type TodoTableprops = {
  header: TodoTableData;
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
  isLoading: boolean;
  selectedTodo: number[];
  setSelectedTodo: React.Dispatch<React.SetStateAction<number[]>>;
};

function TodoTable({
  header,
  setEditDrawer,
  isLoading,
  setEditTask,
  selectedTodo,
  setSelectedTodo,
}: TodoTableprops) {
  const { setNodeRef } = useDroppable({
    id: header.id,
  });
  const { tasks } = useSelector((state: RootState) => state.task);
  const todoData = tasks.filter((task) => task.status === header.id);

  return (
    <div className="mb-10 bg-gray-100">
      <div
        className={`${header.bgColor} flex items-center justify-between px-4 py-3 rounded-t-xl`}
      >
        <h2 className="font-semibold">{header.title}</h2>
        <IoIosArrowUp className="text-2xl" />
      </div>
      {header.id === "todo" && <QuickTaskCreateForm />}
      <div ref={setNodeRef} className={`${todoData.length <= 0 ? "h-32" : ""}`}>
        {!isLoading && todoData && todoData.length > 0 ? (
          todoData.map((item) => (
            <ListViewTodo
              key={item.id}
              todo={item}
              setEditDrawer={setEditDrawer}
              setEditTask={setEditTask}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
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
