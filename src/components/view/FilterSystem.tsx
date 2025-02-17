import { FaThList } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import CategoryFilter from "../ui/CategoryFilter";
import DateFilter from "../ui/DateFilter";
import SearchFilter from "../ui/SearchFilter";

type FilterSystemProps = {
  view: string;
  setView: React.Dispatch<React.SetStateAction<string>>;
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};
function FilterSystem({ view, setView, setDrawer }: FilterSystemProps) {
  return (
    <div className="container px-4 mx-auto flex flex-col gap-6 mt-4 lg:mt-8 xl:mt-12 lg:grid lg:grid-cols-[4fr_2fr_1fr] xl:grid-cols-[4fr_1.6fr_1fr] 2xl:grid-cols-[4fr_1.2fr_1fr]">
      <div className="flex items-center justify-end lg:order-3 lg:w-fit lg:items-end">
        <button
          className="bg-[#7B1984] text-white px-5 py-2 rounded-2xl uppercase font-medium text-sm cursor-pointer hover:bg-transparent border-[#7B1984] border transition-all hover:text-[#7B1984] xl:px-8"
          onClick={() => setDrawer(true)}
        >
          add task
        </button>
      </div>
      <div className="flex flex-col gap-4 lg:order-1">
        <div className="hidden lg:flex lg:gap-4">
          <button
            className={`lg:flex lg:items-center lg:gap-2 lg:border-b-2 lg:pb-1 ${
              view === "list" ? "lg:border-gray-500" : "lg:border-transparent"
            }`}
            onClick={() => setView("list")}
          >
            <FaThList />
            List
          </button>
          <button
            className={`lg:flex lg:items-center lg:gap-2 lg:border-b-2 lg:pb-1 ${
              view === "board" ? "lg:border-gray-500" : "lg:border-transparent"
            }`}
            onClick={() => setView("board")}
          >
            <MdOutlineAnalytics />
            Board
          </button>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <p>Filter by:</p>
          <div className="flex items-center gap-4 relative mt-2 lg:mt-0">
            <CategoryFilter />
            <DateFilter />
          </div>
        </div>
      </div>

      <SearchFilter />
    </div>
  );
}

export default FilterSystem;
