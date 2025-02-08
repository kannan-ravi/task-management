import { useState } from "react";
import FilterSystem from "../../components/view/FilterSystem";
import Header from "../../components/view/Header";
import TodoTable from "../../components/view/TodoTable";
import type { Todos } from "../../utils/types";
import BulkActionBar from "../../components/view/BulkActionBar";

function Home() {
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
    <div>
      <Header />
      <FilterSystem />

      <div className="mt-10">
        <div className="container px-4 mx-auto">
          <TodoTable headerColor="bg-[#FAC3FF]" todos={todos} />
          <TodoTable headerColor="bg-[#85D9F1]" todos={todos} />
          <TodoTable headerColor="bg-[#CEFFCC]" todos={todos} />
        </div>
      </div>

      <BulkActionBar />
    </div>
  );
}

export default Home;
