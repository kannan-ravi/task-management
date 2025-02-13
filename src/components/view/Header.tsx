import { useEffect, useState } from "react";
import Logo from "../../assets/logo/logo.svg";
import { CiLogout } from "react-icons/ci";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router";
import type { RootState } from "../../store";
import { removeAllTask } from "../../features/todo/taskSlice";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
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

  const handleSignOut = async () => {
    try {
      setProfileDropdown((prev) => !prev);
      await auth.signOut();
      dispatch(signOutUser());
      dispatch(removeAllTask());
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

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
            src={
              user?.profile_picture_url ??
              "https://dummyjson.com/icon/abc123/40"
            }
            alt="User Profile Image"
            className="rounded-full w-10 h-10"
            onClick={() => setProfileDropdown(!profileDropdown)}
          />
          <span className="hidden lg:block lg:ml-2">{user?.name}</span>
          {profileDropdown && (
            <div className="absolute right-5 top-16 bg-[#FFF9F9] px-4 py-2 border border-[#7B1984] rounded-lg">
              <button
                onClick={handleSignOut}
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
