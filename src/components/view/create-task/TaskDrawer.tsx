import { IoCloseSharp } from "react-icons/io5";
import CreateFrom from "./CreateFrom";

type TaskDrawerProps = {
  drawer: boolean;
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
};

function TaskDrawer({ drawer, setDrawer }: TaskDrawerProps) {
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
          drawer ? "top-32 lg:top-1/2 lg:-translate-1/2" : "top-full"
        }`}
      >
        <div className="pt-4">
          <div
            className="flex items-center justify-between px-3 lg:px-5"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold">Create Task</h2>
            <IoCloseSharp
              className="text-2xl"
              onClick={() => setDrawer(false)}
            />
          </div>

          <CreateFrom setDrawer={setDrawer} />
        </div>
      </div>
    </>
  );
}

export default TaskDrawer;
