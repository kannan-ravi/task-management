import { IoCloseSharp } from "react-icons/io5";
import CreateFrom from "./CreateFrom";

type TaskDrawerProps = {
  drawer: boolean;
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditTaskDrawer({ drawer, setDrawer }: TaskDrawerProps) {
  return (
    <>
      <div
        className={`fixed left-0 w-full h-full z-20 bg-black opacity-50 ${
          drawer ? "top-0" : "top-full"
        }`}
        onClick={() => setDrawer(false)}
      ></div>

      <div
        className={`fixed left-0 w-full h-full z-20 bg-white rounded-t-2xl lg:rounded-2xl duration-300 lg:max-w-4xl lg:-translate-x-1/2 lg:h-fit lg:left-1/2 ${
          drawer ? "top-6 lg:top-1/2 lg:-translate-1/2" : "top-full"
        }`}
      >
        <div className="pt-4">
          <div
            className="flex items-center justify-end px-3 lg:px-5"
            onClick={(e) => e.stopPropagation()}
          >
            <IoCloseSharp
              className="text-2xl"
              onClick={() => setDrawer(false)}
            />
          </div>

          <div className="flex items-center justify-center px-3 gap-8 mt-3 lg:hidden">
            <button className="bg-black px-14 py-1.5 rounded-full border border-black text-white">
              Details
            </button>
            <button className="px-10 py-1.5 rounded-full border border-black text-black">
              Activity
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-[2fr_1fr]">
            <CreateFrom />
            <div className="mt-6 bg-gray-100">
              <h2 className="py-2 px-3 bg-white">Activity</h2>
              <ul className="py-2 px-3 flex flex-col gap-2">
                <li className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-500">You created this task</p>{" "}
                  <p className="text-sm text-gray-400">Dec 17 at 1:15 pm</p>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-500">You created this task</p>{" "}
                  <p className="text-sm text-gray-400">Dec 17 at 1:15 pm</p>
                </li>
                <li className="flex items-center justify-between gap-2">
                  <p className="text-sm text-gray-500">You created this task</p>{" "}
                  <p className="text-sm text-gray-400">Dec 17 at 1:15 pm</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditTaskDrawer;
