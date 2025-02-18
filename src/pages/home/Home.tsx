import { useEffect, useState } from "react";
import FilterSystem from "../../components/view/FilterSystem";
import Header from "../../components/view/Header";
import BulkActionBar from "../../components/view/BulkActionBar";
import ListTodo from "../../components/view/todo-list/ListTodo";
import BoardTodo from "../../components/view/todo-board/BoardTodo";
import TaskDrawer from "../../components/view/create-task/TaskDrawer";
import EditTaskDrawer from "../../components/view/edit-task/TaskDrawer";
import {
  GetActitvitesTypes,
  GetFilesTypes,
} from "../../utils/types/service-types";
import { EditTaskType } from "../../utils/types/types";
import useFetchTodoData from "../../hooks/useFetchTodoData";

function Home() {
  const [showBulkAction, setShowBulkAction] = useState<boolean>(false);
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [editDrawer, setEditDrawer] = useState<boolean>(false);
  const [view, setView] = useState<string>("list");

  const [editTask, setEditTask] = useState<EditTaskType>({
    task: {
      id: 0,
      user_id: "",
      title: "",
      description: "",
      due_date: "",
      category: "",
      status: "todo",
      created_at: "",
      updated_at: "",
    },
    files: [] as GetFilesTypes[],
    activities: [] as GetActitvitesTypes[],
  });

  useEffect(() => {
    if (selectedTodo.length > 0) {
      setShowBulkAction(true);
    } else {
      setShowBulkAction(false);
    }
  }, [selectedTodo.length]);

  const { isLoading } = useFetchTodoData();
  return (
    <div>
      <Header />
      <FilterSystem setView={setView} view={view} setDrawer={setDrawer} />

      {view === "list" ? (
        <ListTodo
          setEditDrawer={setEditDrawer}
          setEditTask={setEditTask}
          selectedTodo={selectedTodo}
          setSelectedTodo={setSelectedTodo}
          isLoading={isLoading}
        />
      ) : (
        <BoardTodo
          setEditDrawer={setEditDrawer}
          setEditTask={setEditTask}
          isLoading={isLoading}
        />
      )}

      <TaskDrawer setDrawer={setDrawer} drawer={drawer} />

      <EditTaskDrawer
        setDrawer={setEditDrawer}
        drawer={editDrawer}
        editTask={editTask}
        setEditTask={setEditTask}
      />

      <BulkActionBar
        showBulkAction={showBulkAction}
        selectedTodo={selectedTodo}
        setSelectedTodo={setSelectedTodo}
      />
    </div>
  );
}

export default Home;
