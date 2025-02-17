import { IoCloseSharp } from "react-icons/io5";
import EditForm from "./EditForm";
import { EditTaskType } from "../../../utils/types/types";
import { dateTimeFormat } from "../../../utils/helper/function";
import useWindowSize from "../../../hooks/useWindowSize";
import { useState } from "react";

type TaskDrawerProps = {
  drawer: boolean;
  setDrawer: React.Dispatch<React.SetStateAction<boolean>>;
  setEditTask: React.Dispatch<React.SetStateAction<EditTaskType>>;
  editTask: EditTaskType;
};

function EditTaskDrawer({
  drawer,
  setDrawer,
  setEditTask,
  editTask,
}: TaskDrawerProps) {
  const windowSize = useWindowSize();
  const [showActivity, setShowActivity] = useState<boolean>(
    windowSize.width > 1024 ? true : false
  );
  return (
    <>
      <div
        className={`fixed left-0 w-full h-full z-20 bg-black opacity-50 ${
          drawer ? "top-0" : "top-full"
        }`}
        onClick={() => setDrawer(false)}
      ></div>

      <div
        className={`fixed left-0 w-full h-full z-20 bg-white rounded-t-2xl lg:rounded-2xl duration-300 lg:max-w-4xl lg:-translate-x-1/2 lg:h-fit lg:left-1/2 xl:max-w-5xl ${
          drawer
            ? "top-6 lg:top-1/2 lg:-translate-1/2 scale-100"
            : "top-full scale-50"
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
            <button
              className="px-10 py-1.5 rounded-full border border-black text-black"
              onClick={() => setShowActivity(true)}
            >
              Activity
            </button>
          </div>

          <div className="lg:grid lg:grid-cols-[2fr_1fr] xl:grid-cols-[2fr_1.4fr]">
            <EditForm
              setEditTask={setEditTask}
              editTask={editTask}
              setDrawer={setDrawer}
            />
            {windowSize.width > 1024 && showActivity && (
              <div className="mt-6 bg-gray-100">
                <h2 className="py-2 px-3 bg-white">Activity</h2>
                <ul className="py-2 px-3 flex flex-col gap-2">
                  {editTask.activities.map((activity) =>
                    activity.action == "created" ? (
                      <li
                        className="flex items-center justify-between gap-2"
                        key={activity.id}
                      >
                        <p className="text-sm text-gray-500">
                          You {activity.action} this task
                        </p>{" "}
                        <p className="text-sm text-gray-400">
                          {dateTimeFormat(activity.created_at)}
                        </p>
                      </li>
                    ) : activity.action == "status-changed" ? (
                      <li
                        className="flex items-center justify-between gap-2"
                        key={activity.id}
                      >
                        <p className="text-sm text-gray-500">
                          You changed status from{" "}
                          {activity.details.old_value == "in_progress"
                            ? "in progress"
                            : activity.details.old_value}{" "}
                          to{" "}
                          {activity.details.new_value == "in_progress"
                            ? "in progress"
                            : activity.details.new_value}
                        </p>{" "}
                        <p className="text-sm text-gray-400">
                          {dateTimeFormat(activity.created_at)}
                        </p>
                      </li>
                    ) : activity.action == "edited" ? (
                      <li
                        className="flex items-center justify-between gap-2"
                        key={activity.id}
                      >
                        <p className="text-sm text-gray-500">
                          You have edited the task
                        </p>{" "}
                        <p className="text-sm text-gray-400">
                          {dateTimeFormat(activity.created_at)}
                        </p>
                      </li>
                    ) : null
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditTaskDrawer;
