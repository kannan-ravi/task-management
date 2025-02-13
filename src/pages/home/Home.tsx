import { useState } from "react";
import FilterSystem from "../../components/view/FilterSystem";
import Header from "../../components/view/Header";
import BulkActionBar from "../../components/view/BulkActionBar";
import ListTodo from "../../components/view/todo-list/ListTodo";
import BoardTodo from "../../components/view/todo-board/BoardTodo";
import { TodoTableData } from "../../utils/types/types";
import TaskDrawer from "../../components/view/create-task/TaskDrawer";
import EditTaskDrawer from "../../components/view/edit-task/TaskDrawer";

function Home() {
  const [showBulkAction, setShowBulkAction] = useState<boolean>(false);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [editDrawer, setEditDrawer] = useState<boolean>(false);
  const [view, setView] = useState<string>("list");

  const TABLE_DATA: TodoTableData[] = [
    {
      id: "todo",
      title: "To Do",
      bgColor: "bg-pink-200",
    },
    {
      id: "in_progress",
      title: "In Progress",
      bgColor: "bg-blue-200",
    },
    {
      id: "completed",
      title: "Completed",
      bgColor: "bg-green-200",
    },
  ];
  return (
    <div>
      <Header />
      <FilterSystem setView={setView} view={view} setDrawer={setDrawer} />

      {view === "list" ? (
        <ListTodo TABLE_DATA={TABLE_DATA} setEditDrawer={setEditDrawer} />
      ) : (
        <BoardTodo TABLE_DATA={TABLE_DATA} setEditDrawer={setEditDrawer} />
      )}

      <TaskDrawer setDrawer={setDrawer} drawer={drawer} />

      <EditTaskDrawer setDrawer={setEditDrawer} drawer={editDrawer} />

      {showBulkAction && <BulkActionBar />}
    </div>
  );
}

export default Home;
