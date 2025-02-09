import TodoSingleBoard from "./TodoSingleBoard";
function BoardTodo() {
  return (
    <div className="grid grid-cols-3 gap-6 container mx-auto px-4 my-10">
      <TodoSingleBoard title="to-do" headerBackground="bg-pink-200" />
      <TodoSingleBoard title="in-progress" headerBackground="bg-blue-200" />
      <TodoSingleBoard title="completed" headerBackground="bg-green-200" />
    </div>
  );
}

export default BoardTodo;
