import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { RootState } from "../../store";
import { changeDueDateFilter } from "../../features/todo/taskSlice";

function DateFilter() {
  const { due_date_filter } = useSelector((state: RootState) => state.task);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const due_date_value = e.target.value;
    const date = due_date_value
      ? new Date(due_date_value).toISOString().split("T")[0]
      : "";

    dispatch(changeDueDateFilter(date));
  };

  return (
    <div>
      <label
        htmlFor="due_date_filter"
        className="flex items-center justify-between text-black capitalize gap-3 border rounded-full px-3 py-1.5 min-w-32 cursor-pointer w-full"
        onClick={handleClick}
      >
        {due_date_filter === "" ? "Due Date" : due_date_filter}
        <IoIosArrowDown />
      </label>

      <input
        type="datetime-local"
        name="due_date_filter"
        id="due_date_filter"
        ref={inputRef}
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}

export default DateFilter;
