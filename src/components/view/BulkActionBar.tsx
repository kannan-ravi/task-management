import { useEffect, useState } from "react";
import { FaCheckSquare } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

function BulkActionBar() {
  const [builkStatusDropdown, setBuilkStatusDropdown] =
    useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (
        builkStatusDropdown &&
        !target.closest("#bulkaction-status-dropdown")
      ) {
        setBuilkStatusDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [builkStatusDropdown]);
  return (
    <div className="bg-black fixed bottom-4 left-[50%] translate-x-[-50%] rounded-2xl py-3 flex items-center justify-center px-4 gap-1 md:gap-3">
      <div className="mx-auto border border-gray-500 flex items-center justify-start py-2 w-fit rounded-full gap-2 px-4 md:gap-3">
        <p className="text-white text-sm text-nowrap">2 Task Selected</p>
        <IoCloseSharp className="text-white" />
      </div>

      <FaCheckSquare className="text-gray-200 text-xl" />
      <div className="relative" id="bulkaction-status-dropdown">
        <button
          type="button"
          className="bg-black text-white px-4 py-1 rounded-full font-medium cursor-pointer border border-gray-500 text-sm"
          onClick={() => setBuilkStatusDropdown(!builkStatusDropdown)}
        >
          Status
        </button>

        {builkStatusDropdown && (
          <div className="bg-black px-3 py-1 rounded-sm absolute bottom-11 right-0 z-10">
            <p className="uppercase text-nowrap px-1 py-2 tracking-wider text-sm text-white">
              to-do
            </p>
            <p className="uppercase text-nowrap px-1 py-2 tracking-wider font-semibold text-sm text-white">
              in-progress
            </p>
            <p className="uppercase text-nowrap px-1 py-2 tracking-wider text-sm text-white">
              completed
            </p>
          </div>
        )}
      </div>

      <button
        type="button"
        className="bg-black text-red-700 px-4 py-1 rounded-full font-medium cursor-pointer border border-red-700 text-sm"
      >
        Delete
      </button>
    </div>
  );
}

export default BulkActionBar;
