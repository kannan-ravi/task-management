import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useState } from "react";
import { changeCategoryFilter } from "../../features/todo/taskSlice";
import useFetchTodoData from "../../hooks/useFetchTodoData";
import useOutsideClick from "../../hooks/useOutsideClick";

function CategoryFilter() {
  const { category_filter } = useSelector((state: RootState) => state.task);
  const [dropdown, setDropdown] = useState<boolean>(false);
  const { refetch } = useFetchTodoData();
  const dispatch = useDispatch();

  const dropdownValues = [
    { id: "category-dropdown", state: dropdown, setState: setDropdown },
  ];

  useOutsideClick(dropdownValues);

  const handleChangeCategoryFilter = (category: string) => {
    dispatch(changeCategoryFilter(category));
    setDropdown(false);
    refetch();
  };
  return (
    <div id="category-dropdown">
      <p
        className="flex items-center justify-between text-black capitalize gap-3 border rounded-full px-3 py-1.5 min-w-32 cursor-pointer w-full"
        onClick={() => setDropdown(!dropdown)}
      >
        {category_filter === "" ? "all" : category_filter}
        <IoIosArrowDown />
      </p>

      <div
        className={`lg:bg-white lg:px-3 lg:rounded-sm absolute top-14 xl:top-10 z-10 transition-all duration-300 ${
          dropdown
            ? "opacity-100 scale-100 max-h-32"
            : "opacity-0 scale-95 max-h-0 overflow-hidden"
        }`}
      >
        <p
          onClick={() => handleChangeCategoryFilter("")}
          className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer ${
            category_filter === "" ? "font-semibold" : ""
          }`}
        >
          all
        </p>
        <p
          onClick={() => handleChangeCategoryFilter("work")}
          className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer ${
            category_filter === "work" ? "font-semibold" : ""
          }`}
        >
          work
        </p>
        <p
          onClick={() => handleChangeCategoryFilter("personal")}
          className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer ${
            category_filter === "personal" ? "font-semibold" : ""
          }`}
        >
          personal
        </p>
      </div>
    </div>
  );
}

export default CategoryFilter;
