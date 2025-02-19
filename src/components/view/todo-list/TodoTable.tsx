import { IoIosArrowUp } from "react-icons/io";
import ListViewTodo from "./ListViewTodo";
import type {
  EditTaskType,
  TaskStatus,
  TodoTableData,
  useOutsideClickProps,
} from "../../../utils/types/types";
import { useDroppable } from "@dnd-kit/core";
import Loading from "../../ui/Loading";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { FaPlus, FaRegCalendarAlt } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { useRef, useState } from "react";
import {
  CreateActivitiesProps,
  CreateTodoType,
} from "../../../utils/types/service-types";
import { HiMiniArrowTurnDownLeft } from "react-icons/hi2";
import toast from "react-hot-toast";
import {
  useCreateActivitiesMutation,
  useCreateTodoMutation,
} from "../../../services/supabaseApi";
import { createNewTask } from "../../../features/todo/taskSlice";
import useOutsideClick from "../../../hooks/useOutsideClick";

type TodoTableprops = {
  header: TodoTableData;
  setEditDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
  isLoading: boolean;
  selectedTodo: number[];
  setSelectedTodo: React.Dispatch<React.SetStateAction<number[]>>;
};

function TodoTable({
  header,
  setEditDrawer,
  isLoading,
  setEditTask,
  selectedTodo,
  setSelectedTodo,
}: TodoTableprops) {
  const { setNodeRef } = useDroppable({
    id: header.id,
  });
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks } = useSelector((state: RootState) => state.task);
  const todoData = tasks.filter((task) => task.status === header.id);

  const [todo, setTodo] = useState<CreateTodoType>({
    user_id: user?.id ?? undefined,
    title: "",
    description: "",
    due_date: "",
    category: "",
    status: "todo",
  });

  const [taskStatus, setTaskStatus] = useState<TaskStatus | "">("");
  const [statusDropdown, setStatusDropdown] = useState<boolean>(false);
  const [categoryDropdown, setCategoryDropdown] = useState<boolean>(false);
  const [taskForm, setTaskForm] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();

  const dropdownValues: useOutsideClickProps[] = [
    {
      id: "category-dropdown",
      state: categoryDropdown,
      setState: setCategoryDropdown,
    },
    { id: "task-dropdown", state: statusDropdown, setState: setStatusDropdown },
  ];

  useOutsideClick(dropdownValues);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.showPicker();
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const due_date_value = e.target.value;

    setTodo((prevTodo) => ({ ...prevTodo!, due_date: due_date_value }));
  };

  const handleCategory = (category: string) => {
    setTodo((prevTodo) => ({ ...prevTodo!, category: category.toLowerCase() }));
    setCategoryDropdown(false);
  };

  const handleStatus = (status: TaskStatus) => {
    setTaskStatus(status);
    setStatusDropdown(false);
  };

  const [createTodo] = useCreateTodoMutation();
  const [createActivities] = useCreateActivitiesMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!todo.title) return toast.error("Task title cannot be empty");
    if (!todo.category) return toast.error("Task category cannot be empty");
    if (!todo.due_date) return toast.error("Task due date cannot be empty");
    if (!["todo", "in_progress", "completed"].includes(taskStatus))
      return toast.error("Task status cannot be empty");

    try {
      const updatedTodo = {
        ...todo,
        description: "",
        status: taskStatus == "" ? "todo" : taskStatus,
      };

      const createTaskPromise = createTodo(updatedTodo).unwrap();

      toast.promise(createTaskPromise, {
        loading: "Creating task...",
        success: "Task created successfully",
        error: "Failed to create task",
      });

      const createdTask = await createTaskPromise;
      if (createdTask) {
        const activities: CreateActivitiesProps = {
          task_id: createdTask[0].id,
          action: "created",
          details: {
            field: "",
            new_value: "",
            old_value: "",
          },
        };

        await createActivities(activities).unwrap();
        dispatch(createNewTask(createdTask));
        setTaskStatus("");
        setTaskForm(false);
        setTodo({
          user_id: user?.id ?? undefined,
          title: "",
          description: "",
          due_date: "",
          category: "",
          status: "todo",
        });
      }
    } catch (error) {}
  };

  return (
    <div className="mb-10 bg-gray-100">
      <div
        className={`${header.bgColor} flex items-center justify-between px-4 py-3 rounded-t-xl`}
      >
        <h2 className="font-semibold">{header.title}</h2>
        <IoIosArrowUp className="text-2xl" />
      </div>
      {header.id === "todo" && (
        <form onSubmit={handleSubmit} className="hidden lg:block">
          <div
            className="border-b border-gray-400 py-2 px-8 cursor-pointer"
            typeof="button"
            onClick={() => setTaskForm(true)}
          >
            <p className="uppercase tracking-wide flex items-center gap-2">
              <FaPlus /> add task
            </p>
          </div>
          {taskForm && (
            <>
              <div className="lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:py-2 lg:px-4">
                <input
                  type="text"
                  className="px-4 py-2 border-0 outline-0 lg:self-center"
                  placeholder="Task Title"
                  value={todo.title}
                  onChange={(e) => setTodo({ ...todo, title: e.target.value })}
                />
                <div className="self-center">
                  <label
                    htmlFor="due_date_filter"
                    className="flex items-center text-black capitalize gap-3 border border-gray-400 rounded-full px-3 py-1 cursor-pointer max-w-32 "
                    onClick={handleClick}
                  >
                    <FaRegCalendarAlt />
                    {todo.due_date
                      ? new Date(todo.due_date).toLocaleString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      : "Add Date"}
                  </label>

                  <input
                    type="datetime-local"
                    name="due_date_filter"
                    id="due_date_filter"
                    ref={inputRef}
                    onChange={handleDateChange}
                    className="hidden"
                  />
                </div>

                <div className="self-center relative" id="category-dropdown">
                  <div className="flex gap-2">
                    <p className="uppercase">{taskStatus}</p>
                    <GoPlus
                      className="text-2xl border rounded-full"
                      onClick={() => setCategoryDropdown(!categoryDropdown)}
                    />
                  </div>
                  <div
                    className={`lg:bg-white lg:px-3 lg:rounded-sm absolute top-14 xl:top-10 z-10 transition-all duration-300 ${
                      categoryDropdown
                        ? "opacity-100 scale-100 max-h-32 overflow-visible"
                        : "opacity-0 scale-95 max-h-0 overflow-hidden"
                    }`}
                  >
                    <p
                      onClick={() => handleStatus("todo")}
                      className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer`}
                    >
                      to-do
                    </p>
                    <p
                      onClick={() => handleStatus("in_progress")}
                      className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer`}
                    >
                      in-progress
                    </p>
                    <p
                      onClick={() => handleStatus("completed")}
                      className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer`}
                    >
                      completed
                    </p>
                  </div>
                </div>
                <div className="self-center relative" id="task-dropdown">
                  <div className="flex gap-2">
                    <p className="uppercase">{todo.category}</p>
                    <GoPlus
                      className="text-2xl border rounded-full"
                      onClick={() => setStatusDropdown(!statusDropdown)}
                    />
                  </div>
                  <div
                    className={`lg:bg-white lg:px-3 lg:rounded-sm absolute top-14 xl:top-10 z-10 transition-all duration-300 ${
                      statusDropdown
                        ? "opacity-100 scale-100 max-h-32"
                        : "opacity-0 scale-95 max-h-0 overflow-hidden"
                    }`}
                  >
                    <p
                      onClick={() => handleCategory("work")}
                      className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer`}
                    >
                      work
                    </p>
                    <p
                      onClick={() => handleCategory("personal")}
                      className={`lg:text-sm lg:uppercase text-nowrap px-1 py-2 tracking-wider cursor-pointer`}
                    >
                      personal
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 px-8 py-3">
                <button className="bg-[#7B1984] text-white px-5 py-2 rounded-2xl uppercase font-medium text-sm flex items-center gap-2 border-[#7B1984] border hover:bg-transparent duration-300 hover:text-[#7B1984]">
                  add{" "}
                  <HiMiniArrowTurnDownLeft className="text-lg" type="submit" />
                </button>
                <button
                  className="bg-transparent text-black px-5 py-2 rounded-2xl uppercase font-medium text-sm"
                  type="button"
                  onClick={() => setTaskForm(false)}
                >
                  cancel
                </button>
              </div>
            </>
          )}
        </form>
      )}
      <div ref={setNodeRef} className={`${todoData.length <= 0 ? "h-32" : ""}`}>
        {!isLoading && todoData && todoData.length > 0 ? (
          todoData.map((item) => (
            <ListViewTodo
              key={item.id}
              todo={item}
              setEditDrawer={setEditDrawer}
              setEditTask={setEditTask}
              selectedTodo={selectedTodo}
              setSelectedTodo={setSelectedTodo}
            />
          ))
        ) : isLoading ? (
          <Loading />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500 text-normal">
              No Tasks in {header.title}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TodoTable;
