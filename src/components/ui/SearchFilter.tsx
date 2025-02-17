import { FaMagnifyingGlass } from "react-icons/fa6";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { changeSearchFilter } from "../../features/todo/taskSlice";
import useFetchTodoData from "../../hooks/useFetchTodoData";

function SearchFilter() {
  const { search_filter } = useSelector((state: RootState) => state.task);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const dispatch = useDispatch();
  const { refetch } = useFetchTodoData();

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        dispatch(changeSearchFilter(term));
        refetch();
      }, 1000);
    },
    [dispatch, refetch]
  );

  useEffect(() => {
    // Update search term when the search_filter from Redux store changes
    setSearchTerm(search_filter);
  }, [search_filter]);
  return (
    <div className="lg:order-2 lg:w-full lg:flex lg:items-end">
      <div className="flex items-center gap-4 relative xl:w-full lg:items-end">
        <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
          className="w-full ps-10 pe-4 py-2 rounded-full border border-gray-500 placeholder:text-black font-medium"
        />
      </div>
    </div>
  );
}

export default SearchFilter;
