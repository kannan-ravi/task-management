import BoardTodoCard from "./BoardTodoCard";

type TodoSingleBoardProps = {
  title: string;
  headerBackground: string;
};

function TodoSingleBoard({ title, headerBackground }: TodoSingleBoardProps) {
  return (
    <div className="p-4 bg-[#F1F1F1] rounded-2xl">
      <div className="flex items-center gap-2">
        <h2
          className={`tracking-wide uppercase font-semibold px-2 py-1 rounded-sm ${headerBackground}`}
        >
          {title}
        </h2>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        <BoardTodoCard />
        <BoardTodoCard />
        <BoardTodoCard />
      </div>
    </div>
  );
}

export default TodoSingleBoard;
