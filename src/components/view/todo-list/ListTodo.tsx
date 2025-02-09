import { useState } from "react";
import TodoTable from "./TodoTable";
import type { Todos } from "../../../utils/types";

function ListTodo() {
  const [todos, setTodos] = useState<Todos[]>([
    {
      id: 1,
      title: "Interview with Design Team",
      date: "Today",
      status: "TO-DO",
      category: "Work",
    },
    {
      id: 2,
      title: "Interview with Design Team",
      date: "Today",
      status: "IN-PROGRESS",
      category: "Work",
    },
  ]);
  return (
    <div className="mt-10">
      <div className="container px-4 mx-auto">
        <TodoTable headerColor="bg-[#FAC3FF]" todos={todos} />
        <TodoTable headerColor="bg-[#85D9F1]" todos={todos} />
        <TodoTable headerColor="bg-[#CEFFCC]" todos={todos} />
      </div>
    </div>
  );
}

export default ListTodo;
