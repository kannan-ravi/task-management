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
  const isDesktop = windowSize.width > 1024;
  const [showActivity, setShowActivity] = useState<boolean>(isDesktop);

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
          <div className="flex items-center justify-end px-3 lg:px-5">
            <IoCloseSharp
              className="text-2xl cursor-pointer"
              onClick={() => setDrawer(false)}
            />
          </div>

          {!isDesktop && (
            <div className="flex items-center justify-center px-3 gap-8 mt-3">
              <button
                className={`px-14 py-1.5 rounded-full border ${
                  !showActivity
                    ? "bg-black text-white border-black"
                    : "border-gray-400 text-black"
                }`}
                onClick={() => setShowActivity(false)}
              >
                Details
              </button>
              <button
                className={`px-10 py-1.5 rounded-full border ${
                  showActivity
                    ? "bg-black text-white border-black"
                    : "border-gray-400 text-black"
                }`}
                onClick={() => setShowActivity(true)}
              >
                Activity
              </button>
            </div>
          )}

          <div className="lg:grid lg:grid-cols-[2fr_1fr] xl:grid-cols-[2fr_1.4fr]">
            {isDesktop ? (
              <>
                <EditForm
                  setEditTask={setEditTask}
                  editTask={editTask}
                  setDrawer={setDrawer}
                />
                <div className="mt-6 bg-gray-100">
                  <h2 className="py-2 px-3 bg-white">Activity</h2>
                  <ul className="py-2 px-3 flex flex-col gap-2 overflow-hidden h-100 max-h-[calc(100%-80px)]">
                    {editTask.activities.map((activity) => (
                      <li
                        className="flex items-center justify-between gap-2 py-1"
                        key={activity.id}
                      >
                        <p className="text-sm text-gray-500">
                          {activity.action === "created"
                            ? `You ${activity.action} this task`
                            : activity.action === "status-changed"
                            ? `You changed status from ${
                                activity.details.old_value === "in_progress"
                                  ? "in progress"
                                  : activity.details.old_value
                              } to ${
                                activity.details.new_value === "in_progress"
                                  ? "in progress"
                                  : activity.details.new_value
                              }`
                            : "You have edited the task"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {dateTimeFormat(activity.created_at)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : showActivity ? (
              <div className="mt-6 bg-gray-100">
                <h2 className="py-2 px-3 bg-white">Activity</h2>
                <ul className="pt-2 pb-7 px-3 flex flex-col gap-2  overflow-y-auto lg:overflow-y-scroll h-100">
                  {editTask.activities.map((activity) => (
                    <li
                      className="flex items-center justify-between gap-2 px-1 py-1"
                      key={activity.id}
                    >
                      <p className="text-sm text-gray-500">
                        {activity.action === "created"
                          ? `You ${activity.action} this task`
                          : activity.action === "status-changed"
                          ? `You changed status from ${
                              activity.details.old_value === "in_progress"
                                ? "in progress"
                                : activity.details.old_value
                            } to ${
                              activity.details.new_value === "in_progress"
                                ? "in progress"
                                : activity.details.new_value
                            }`
                          : "You have edited the task"}
                      </p>
                      <p className="text-sm text-gray-400">
                        {dateTimeFormat(activity.created_at)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <EditForm
                setEditTask={setEditTask}
                editTask={editTask}
                setDrawer={setDrawer}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default EditTaskDrawer;
