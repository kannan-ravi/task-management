import { useEffect, useState } from "react";
import Tiptap from "../Tiptap";
import { EditTaskType } from "../../../utils/types/types";
import { AiFillFilePdf, AiFillFileWord } from "react-icons/ai";
import { FiX } from "react-icons/fi";
import {
  useCreateActivitiesMutation,
  useEditTodoMutation,
} from "../../../services/supabaseApi";
import {
  CreateActivitiesProps,
  GetTodoTypes,
} from "../../../utils/types/service-types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { editTodoTask } from "../../../features/todo/taskSlice";

type EditFromProps = {
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
  editTask: EditTaskType;
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditForm({ setEditTask, editTask, setDrawer }: EditFromProps) {
  const dispatch = useDispatch();
  const [content, setContent] = useState<string>(editTask.task.description);

  const handleOnChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    setEditTask((prevTodo) => ({
      ...prevTodo,
      task: { ...prevTodo.task, [e.target.name]: e.target.value },
    }));
  };
  const handleCategory = (category: string) => {
    setEditTask((prevTodo) => ({
      ...prevTodo,
      task: { ...prevTodo.task, category: category.toLowerCase() },
    }));
  };

  const getFileExtension = (url: string): string => {
    return url.split(".").pop() || "";
  };

  // const removeFile = (index: number) => {
  //   setFiles(files.filter((_, i) => i !== index));
  // };

  const [editTodo] = useEditTodoMutation();
  const [createActivities] = useCreateActivitiesMutation();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTodo: GetTodoTypes = {
      ...editTask.task,
      description: content,
    };
    const { id, title, description, category, due_date, status } = updatedTodo;
    const editedTodo = { id, title, description, category, due_date, status };

    try {
      const updateTaskPromise = editTodo(editedTodo).unwrap();
      toast.promise(updateTaskPromise, {
        loading: "Updating task...",
        success: "Task updated successfully!",
        error: "Error updating task",
      });
      const updatedTask = await updateTaskPromise;

      if (updatedTask) {
        const activities: CreateActivitiesProps = {
          task_id: editTask.task.id,
          action: "edited",
          details: {
            field: "",
            old_value: "",
            new_value: "",
          },
        };

        await createActivities(activities).unwrap();
        dispatch(
          editTodoTask({
            todo: updatedTask,
            id: updatedTask.id,
          })
        );

        setDrawer(false);
      }
    } catch (error) {}
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <div className="mt-4 flex flex-col gap-5 overflow-scroll max-h-[calc(100vh-202px)] px-3 pb-4 lg:p-5 webkit-scrollbar-none lg:max-h-[calc(100vh-200px)]">
        <input
          type="text"
          className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-full p-2.5"
          placeholder="Task Title"
          name="title"
          value={editTask.task.title}
          onChange={handleOnChange}
          required
        />
        <Tiptap
          description={editTask.task.description}
          setDescription={setContent}
          editing={true}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Task Category*</p>
            <div className="flex gap-3">
              <p
                onClick={() => handleCategory("work")}
                className={`border px-4 py-1 text-sm rounded-full cursor-pointer lg:text-md ${
                  editTask.task.category === "work"
                    ? "bg-[#7B1984] text-white border-[#7B1984]"
                    : "bg-white border-gray-400 text-black"
                }`}
              >
                Work
              </p>
              <p
                onClick={() => handleCategory("personal")}
                className={`border px-4 py-1 text-sm rounded-full cursor-pointer ${
                  editTask.task.category === "personal"
                    ? "bg-[#7B1984] text-white border-[#7B1984]"
                    : "bg-white border-gray-400 text-black"
                }`}
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
              id="due-date"
              name="due_date"
              value={editTask.task.due_date}
              onChange={handleOnChange}
              className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-fit p-2.5 lg:w-40"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm">
              Task Status*
            </label>
            <select
              className="bg-white px-2 py-2 rounded-lg border border-gray-400 w-fit min-w-48 lg:min-w-40"
              value={editTask.task.status}
              name="status"
              onChange={handleOnChange}
            >
              <option
                value="todo"
                className="px-2 py-1 text-sm cursor-pointer border-b border-gray-400"
              >
                To Do
              </option>
              <option
                value="in_progress"
                className="px-2 py-1 text-sm cursor-pointer border-b border-gray-400"
              >
                In Progress
              </option>
              <option
                value="completed"
                className="px-2 py-1 text-sm cursor-pointer border-b border-gray-400"
              >
                Completed
              </option>
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
              // onChange={handleFileUpload}
              accept=".png, .jpg, .jpeg, .pdf, .doc, .docx"
            />
            <div className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-full text-center py-8 px-1 cursor-pointer mt-2">
              Drop your files here or{" "}
              <span className="text-blue-500 underline">Update</span>
            </div>
          </label>

          {editTask.files.length > 0 && (
            <div className="mt-2 p-2 rounded-lg bg-white">
              <ul className="mt-2 flex flex-wrap gap-2">
                {editTask.files[0].files_url.map((file, index) => {
                  const extension = getFileExtension(file);

                  const isImage =
                    extension === "png" ||
                    extension === "jpg" ||
                    extension === "jpeg";
                  const isPdf = extension === "pdf";
                  const isDoc = extension === "doc" || extension === "docx";

                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center mt-1 relative w-fit"
                    >
                      <div className="flex items-center flex-col gap-2">
                        {isImage && (
                          <img
                            src={file}
                            alt="PDF file"
                            className="w-24 h-24 rounded object-cover"
                          />
                        )}

                        {isPdf && (
                          <div className="w-24 h-24 flex items-center justify-center">
                            <AiFillFilePdf className="text-red-500 text-4xl" />
                          </div>
                        )}
                        {isDoc && (
                          <div className="w-24 h-24 flex items-center justify-center">
                            <AiFillFileWord className="text-blue-500 mr-2 text-4xl" />
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        className="absolute top-2 right-0 bg-gray-100 rounded-full p-0.5"
                        // onClick={() => removeFile(index)}
                      >
                        <FiX className="text-sm" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-5 justify-end py-3 bg-gray-100 px-3 border-t border-gray-400 rounded-t-xl lg:rounded-b-2xl lg:rounded-t-none">
        <button className="bg-white  px-6 py-2 rounded-2xl uppercase font-medium text-sm cursor-pointer border border-gray-400">
          cancel
        </button>
        <button className="bg-[#7B1984] text-white px-6 py-2 rounded-2xl uppercase font-medium text-sm cursor-pointer hover:bg-transparent border border-[#7B1984] hover:text-[#7B1984] duration-300">
          update
        </button>
      </div>
    </form>
  );
}
export default EditForm;
