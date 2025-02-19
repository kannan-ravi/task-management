import { useState } from "react";
import Logo from "../../assets/logo/logo.svg";
import { CiLogout } from "react-icons/ci";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signOutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router";
import type { RootState } from "../../store";
import { removeAllFilter, removeAllTask } from "../../features/todo/taskSlice";
import { supabaseApi } from "../../services/supabaseApi";
import useOutsideClick from "../../hooks/useOutsideClick";

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [profileDropdown, setProfileDropdown] = useState<boolean>(false);

  const dropdownValues = [
    {
      id: "profile-dropdown",
      state: profileDropdown,
      setState: setProfileDropdown,
    },
  ];

  useOutsideClick(dropdownValues);

  const handleSignOut = async () => {
    try {
      setProfileDropdown((prev) => !prev);
      await auth.signOut();
      dispatch(signOutUser());
      dispatch(removeAllTask());
      dispatch(removeAllFilter());
      dispatch(supabaseApi.util.resetApiState());
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
        <div className="flex items-center relative" id="profile-dropdown">
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
          <div
            className={`absolute right-10 top-12 bg-[#FFF9F9] px-4 py-2 border border-[#7B1984] rounded-lg transition-all duration-300 ease-in-out ${
              profileDropdown
                ? "opacity-100 translate-y-0 visible"
                : "opacity-0 -translate-y-3 invisible"
            }`}
          >
            <button onClick={handleSignOut} className="flex items-center gap-2">
              <CiLogout />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
