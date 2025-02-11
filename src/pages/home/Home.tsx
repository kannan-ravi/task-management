import { useState } from "react";
import FilterSystem from "../../components/view/FilterSystem";
import Header from "../../components/view/Header";
import BulkActionBar from "../../components/view/BulkActionBar";
import ListTodo from "../../components/view/todo-list/ListTodo";
import BoardTodo from "../../components/view/todo-board/BoardTodo";
import { Todos, TodoTableData } from "../../utils/types";
import TaskDrawer from "../../components/view/create-task/TaskDrawer";
import EditTaskDrawer from "../../components/view/edit-task/TaskDrawer";

function Home() {
  const [showBulkAction, setShowBulkAction] = useState<boolean>(false);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [editDrawer, setEditDrawer] = useState<boolean>(false);
  const [view, setView] = useState<string>("list");

  const [todos, setTodos] = useState<Todos[]>([
    {
      id: "1",
      title: "Interview with Design Team",
      date: "Today",
      status: "to-do",
      category: "Work",
    },
    {
      id: "2",
      title: "Interview with Backend Team",
      date: "Tomorrow",
      status: "in-progress",
      category: "Work",
    },
    {
      id: "3",
      title: "Planning with Manager",
      date: "Tomorrow",
      status: "in-progress",
      category: "Work",
    },
    {
      id: "4",
      title: "Create Wireframe for Homepage",
      date: "Tomorrow",
      status: "completed",
      category: "Work",
    },
    {
      id: "5",
      title: "Create Wireframe for Homepage",
      date: "Tomorrow",
      status: "in-progress",
      category: "Work",
    },
    {
      id: "6",
      title: "Create Wireframe for Homepage",
      date: "Tomorrow",
      status: "completed",
      category: "Work",
    },
  ]);

  const filteredTodos = todos.filter((todo) => todo.status === "to-do");
  const filteredCompleted = todos.filter((todo) => todo.status === "completed");
  const filteredInProgress = todos.filter(
    (todo) => todo.status === "in-progress"
  );

  const TABLE_DATA: TodoTableData[] = [
    {
      id: "to-do",
      title: "To Do",
      bgColor: "bg-pink-200",
      data: filteredTodos,
    },
    {
      id: "in-progress",
      title: "In Progress",
      bgColor: "bg-blue-200",
      data: filteredInProgress,
    },
    {
      id: "completed",
      title: "completed",
      bgColor: "bg-green-200",
      data: filteredCompleted,
    },
  ];
  return (
    <div>
      <Header />
      <FilterSystem setView={setView} view={view} setDrawer={setDrawer} />

      {view === "list" ? (
        <ListTodo
          TABLE_DATA={TABLE_DATA}
          todos={todos}
          setTodos={setTodos}
          setEditDrawer={setEditDrawer}
        />
      ) : (
        <BoardTodo TABLE_DATA={TABLE_DATA} todos={todos} setTodos={setTodos} />
      )}

      <TaskDrawer setDrawer={setDrawer} drawer={drawer} />

      <EditTaskDrawer setDrawer={setEditDrawer} drawer={editDrawer} />

      {showBulkAction && <BulkActionBar />}
    </div>
  );
}

export default Home;
