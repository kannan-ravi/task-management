import { useEffect, useState } from "react";
import Logo from "../../assets/logo/logo.svg";
import { CiLogout } from "react-icons/ci";

function Header() {
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (profileDropdown && !target.closest("#profile-dropdown")) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [profileDropdown]);
  return (
    <header className="bg-[#FAEEFC] py-3">
      <div className="container mx-auto px-4 flex item-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={Logo}
            alt="Task Management Logo"
            className="w-7 hidden lg:flex"
          />
          <h1 className="text-lg font-medium text-[#7B1984] lg:text-black">
            TaskBuddy
          </h1>
        </div>
        <div className="flex items-center" id="profile-dropdown">
          <img
            src="https://randomuser.me/api/portraits/thumb/men/75.jpg"
            alt="User Profile Image"
            className="rounded-full w-10 h-10"
            onClick={() => setProfileDropdown(!profileDropdown)}
          />
          <span className="hidden lg:block lg:ml-2">John Doe</span>
          {profileDropdown && (
            <div className="absolute right-5 top-16 bg-[#FFF9F9] px-4 py-2 border border-[#7B1984] rounded-lg">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center gap-2"
              >
                <CiLogout />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
