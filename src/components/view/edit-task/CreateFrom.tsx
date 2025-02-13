import { useState } from "react";
import Tiptap from "../Tiptap";

function CreateFrom() {
  const [description, setDescription] = useState<string>("<p>Interview with the <strong>Design Team</strong></p>");
  return (
    <form className="mt-6" onSubmit={(e) => e.preventDefault()}>
      <div className="mt-4 flex flex-col gap-5 overflow-scroll max-h-[calc(100vh-202px)] px-3 pb-4 lg:p-5 webkit-scrollbar-none lg:max-h-[calc(100vh-200px)]">
        <input
          type="text"
          className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-full p-2.5"
          placeholder="Task Title"
          name="title"
          defaultValue={"Task Title"}
          required
        />
        <Tiptap description={description} setDescription={setDescription} />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 lg:items-center">
          <div className="flex flex-col gap-2">
            <p className="text-sm">Task Category*</p>
            <div className="flex gap-3">
              <p className="bg-white border border-gray-400 px-4 py-1 text-sm rounded-full cursor-pointer lg:text-md">
                Work
              </p>
              <p className="bg-[#7B1984] text-white border border-[#7B1984] px-4 py-1 text-sm rounded-full cursor-pointer">
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
              className="bg-gray-50 border border-gray-400 tracking-wide rounded-lg block w-fit p-2.5 lg:w-40"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="status" className="text-sm">
              Task Status*
            </label>
            <select className="bg-white px-2 py-2 rounded-lg border border-gray-400 w-fit min-w-48 lg:min-w-40">
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
