import { useState } from "react";
import FilterSystem from "../../components/view/FilterSystem";
import Header from "../../components/view/Header";
import BulkActionBar from "../../components/view/BulkActionBar";
import ListTodo from "../../components/view/todo-list/ListTodo";
import BoardTodo from "../../components/view/todo-board/BoardTodo";

function Home() {
  const [showBulkAction, setShowBulkAction] = useState<boolean>(false);
  const [view, setView] = useState<string>("list");

  return (
    <div>
      <Header />
      <FilterSystem setView={setView} view={view} />

      {view === "list" ? <ListTodo /> : <BoardTodo />}

      {showBulkAction && <BulkActionBar />}
    </div>
  );
}

export default Home;
