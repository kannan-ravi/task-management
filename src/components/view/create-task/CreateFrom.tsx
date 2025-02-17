import { useState } from "react";
import Tiptap from "../Tiptap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
  useCreateActivitiesMutation,
  useCreateFileMutation,
  useCreateTodoMutation,
} from "../../../services/supabaseApi";
import {
  CreateActivitiesProps,
  CreateTodoType,
} from "../../../utils/types/service-types";
import { createNewTask } from "../../../features/todo/taskSlice";
import toast from "react-hot-toast";
import { FiX } from "react-icons/fi";
import { AiFillFilePdf, AiFillFileWord } from "react-icons/ai";
import supabase from "../../../supabase";

type CreateFromProps = {
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateFrom({ setDrawer }: CreateFromProps) {
  const { user } = useSelector((state: RootState) => state.auth);
  const [createTodo] = useCreateTodoMutation();
  const [createFile] = useCreateFileMutation();
  const [createActivities] = useCreateActivitiesMutation();

  const dispatch = useDispatch();

  const [description, setDescription] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
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

  const validateForm = (data: CreateTodoType) => {
    if (!data.title) return "Task title cannot be empty";
    if (!data.category) return "Task category cannot be empty";
    if (!data.due_date) return "Task due date cannot be empty";
    if (!["todo", "in_progress", "completed"].includes(data.status))
      return "Task status is invalid";

    return null;
  };

  const uploadFiles = async (files: File[]): Promise<string[]> => {
    const bucketName = import.meta.env.VITE_SUPABASE_BUCKET_NAME;
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileNumber = i + 1;
      const filePath = `uploads/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error(`Upload Error ${fileNumber}:`, error.message);
        toast.error(`Failed to upload file ${fileNumber}`);
        continue;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);
      uploadedUrls.push(publicUrlData.publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedTodo = { ...todo, description };

    const errorMessage = validateForm(updatedTodo);
    if (errorMessage) {
      toast.error(errorMessage);
      return;
    }

    try {
      const createTaskPromise = createTodo(updatedTodo).unwrap();

      await toast.promise(createTaskPromise, {
        loading: "Creating task...",
        success: "Task created successfully!",
        error: "Error creating task",
      });

      const createdTask = await createTaskPromise;

      if (createdTask) {
        if (files.length > 0) {
          await toast.promise(
            async () => {
              const uploadedUrls = await uploadFiles(files);
              const uploadedFilesPromise = createFile({
                task_id: createdTask[0].id,
                files_url: uploadedUrls,
              }).unwrap();
              await uploadedFilesPromise;
            },
            {
              loading: "Uploading files...",
              success: "Files Uploaded!",
              error: "Error uploading files",
            }
          );
        }

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
        setDrawer(false);
        setDescription("");
        setFiles([]);
        setTodo({
          user_id: user?.id ?? undefined,
          title: "",
          description: "",
          due_date: "",
          category: "work",
          status: "todo",
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files);
      setFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);

      event.target.value = "";
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <form className="mt-6" onSubmit={handleSubmit}>
      <div className="mt-4 flex flex-col gap-5 overflow-scroll max-h-[calc(100vh-262px)] px-3 pb-4 lg:p-5 webkit-scrollbar-none lg:max-h-[calc(100vh-200px)]">
        <input
          type="text"
          className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-full p-2.5"
          placeholder="Task Title"
          name="title"
          value={todo?.title}
          onChange={handleChange}
          required
        />
        <Tiptap
          description={description}
          setDescription={setDescription}
          editing={false}
        />

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
              value={todo?.due_date}
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
              onChange={handleFileUpload}
              accept=".png, .jpg, .jpeg, .pdf, .doc, .docx"
            />
            <div className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-full text-center py-8 px-1 cursor-pointer mt-2">
              Drop your files here or{" "}
              <span className="text-blue-500 underline">Update</span>
            </div>
          </label>

          {files.length > 0 && (
            <div className="mt-2 p-2 rounded-lg bg-white">
              <ul className="mt-2 flex flex-wrap gap-2">
                {files.map((file, index) => {
                  const isImage = file.type.includes("image");
                  const isPdf = file.type.includes("pdf");
                  const isDoc =
                    file.type.includes("msword") ||
                    file.type.includes("officeOpenXML") ||
                    file.type.includes("docx") ||
                    file.type.includes("doc");

                  return (
                    <li
                      key={index}
                      className="flex justify-between items-center mt-1 relative w-fit"
                    >
                      <div className="flex items-center flex-col gap-2">
                        {isImage && (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
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
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <button
                        type="button"
                        className="absolute top-2 right-0 bg-gray-100 rounded-full p-0.5"
                        onClick={() => removeFile(index)}
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
        <button
          className="bg-white  px-6 py-2 rounded-2xl uppercase font-medium text-sm cursor-pointer border border-gray-400"
          type="button"
        >
          cancel
        </button>
        <button
          className="bg-[#7B1984] text-white px-6 py-2 rounded-2xl uppercase font-medium text-sm cursor-pointer hover:bg-transparent border border-[#7B1984] hover:text-[#7B1984] duration-300"
          type="submit"
        >
          Create
        </button>
      </div>
    </form>
  );
}
export default CreateFrom;
