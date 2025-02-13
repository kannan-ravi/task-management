import { useState } from "react";
import Tiptap from "../Tiptap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useCreateTodoMutation } from "../../../services/supabaseApi";
import { CreateTodoType } from "../../../utils/types/service-types";
import { addTask, createNewTask } from "../../../features/todo/taskSlice";
import toast from "react-hot-toast";

type CreateFromProps = {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateFrom({ setDrawer }: CreateFromProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [createTodo] = useCreateTodoMutation();

  const dispatch = useDispatch();

  const [description, setDescription] = useState<string>("");
  const [todo, setTodo] = useState<CreateTodoType>({
    user_id: user?.id ?? undefined,
    title: "",
    description: "",
    due_date: "",
    category: "work",
    status: "todo",
  });

  const handleCategory = (category: string) => {
    setTodo((prevTodo) => ({ ...prevTodo!, category: category.toLowerCase() }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setTodo((prevTodo) => ({
      ...prevTodo!,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTodo = { ...todo, description };
    try {
      const createTaskPromise = createTodo(updatedTodo).unwrap();

      await toast.promise(createTaskPromise, {
        loading: "Creating task...",
        success: "Task created!",
        error: "Error creating task",
      });

      const createdTask = await createTaskPromise;

      if (createdTask) {
        dispatch(createNewTask({ todo: createdTask, status: todo.status }));
        setDrawer(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <div className="mt-4 flex flex-col gap-5 overflow-scroll max-h-[calc(100vh-262px)] px-3 pb-4 lg:p-5 webkit-scrollbar-none lg:max-h-[calc(100vh-200px)]">
        <input
          type="text"
          className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-full p-2.5"
          placeholder="Task Title"
          name="title"
          onChange={handleChange}
          required
        />
        <Tiptap description={description} setDescription={setDescription} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Task Category*</p>
            <div className="flex gap-3">
              <p
                className={`border px-4 py-1 text-sm rounded-full cursor-pointer lg:text-md ${
                  todo?.category === "work"
                    ? "bg-[#7B1984] text-white border-[#7B1984]"
                    : "bg-white border-gray-400 text-black"
                }`}
                onClick={() => handleCategory("Work")}
              >
                Work
              </p>
              <p
                className={`border px-4 py-1 text-sm rounded-full cursor-pointer ${
                  todo?.category === "personal"
                    ? "bg-[#7B1984] text-white border-[#7B1984]"
                    : "bg-white border-gray-400 text-black"
                }`}
                onClick={() => handleCategory("Personal")}
              >
                Personal
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="due-date" className="text-sm">
              Due on*
            </label>
            <input
              type="datetime-local"
              id="due_date"
              name="due_date"
              onChange={handleChange}
              className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-fit p-2.5"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm">
              Task Status*
            </label>
            <select
              className="bg-white px-2 py-2 rounded-lg border border-gray-400 w-fit min-w-48"
              name="status"
              id="status"
              onChange={handleChange}
              value={todo?.status}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="attachment" className="text-sm">
            <p className="text-sm">Attachment</p>
            <input
              type="file"
              name="attachment"
              id="attachment"
              className="hidden"
            />
            <div className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-full text-center py-8 px-1 cursor-pointer mt-2">
              Drop your files here or{" "}
              <span className="text-blue-500 underline">Update</span>
            </div>
          </label>
        </div>
      </div>

      <div className="flex gap-5 justify-end py-3 bg-gray-100 px-3 border-t border-gray-400 rounded-t-xl lg:rounded-b-2xl lg:rounded-t-none">
        <button className="bg-white  px-6 py-2 rounded-2xl uppercase font-medium text-sm cursor-pointer border border-gray-400">
          cancel
        </button>
        <button className="bg-[#7B1984] text-white px-6 py-2 rounded-2xl uppercase font-medium text-sm cursor-pointer hover:bg-transparent border border-[#7B1984] hover:text-[#7B1984] duration-300">
          Create
        </button>
      </div>
    </form>
  );
}
export default CreateFrom;
