import { FaThList } from "react-icons/fa";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { MdOutlineAnalytics } from "react-icons/md";
function FilterSystem() {
  const filterDropdown: string[] = ["All", "Work", "Personal"];
  return (
    <div className="container px-4 mx-auto flex flex-col gap-6 mt-4 lg:mt-8 xl:mt-12 lg:grid lg:grid-cols-[4fr_2fr_1fr] xl:grid-cols-[4fr_1.6fr_1fr] 2xl:grid-cols-[4fr_1.2fr_1fr]">
      <div className="flex items-center justify-end lg:order-3 lg:w-fit lg:items-end">
        <button className="bg-[#7B1984] text-white px-5 py-2 rounded-2xl uppercase font-medium text-sm cursor-pointer hover:bg-transparent border-[#7B1984] border transition-all hover:text-[#7B1984] xl:px-8">
          add task
        </button>
      </div>
      <div className="flex flex-col gap-4 lg:order-1">
        <div className="hidden lg:flex lg:gap-4">
          <button className="lg:flex lg:items-center lg:gap-2 lg:border-b-2 lg:border-gray-500 lg:pb-1">
            <FaThList />
            List
          </button>
          <button className="lg:flex lg:items-center lg:gap-2 lg:border-b-2 lg:border-transparent lg:pb-1">
            <MdOutlineAnalytics />
            Board
          </button>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <p>Filter by:</p>
          <div className="flex items-center gap-4 relative mt-2 lg:mt-0">
            <select className="bg-white border border-gray-500 text-gray-900 text-sm block w-full py-2 px-4 rounded-full tracking-wider max-w-32">
              <option defaultValue={""}>Category</option>
              {filterDropdown.map((item, index) => (
                <option key={index}>{item}</option>
              ))}
            </select>
            <input
              type="datetime-local"
              className="bg-white border border-gray-500 text-gray-900 text-sm block w-full py-2 px-4 rounded-full tracking-wider max-w-36"
            />
          </div>
        </div>
      </div>

      <div className="lg:order-2 lg:w-full lg:flex lg:items-end">
        <div className="flex items-center gap-4 relative xl:w-full lg:items-end">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full ps-10 pe-4 py-2 rounded-full border border-gray-500 placeholder:text-black font-medium"
          />
        </div>
      </div>
    </div>
  );
}

export default FilterSystem;
