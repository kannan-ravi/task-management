import GoogleLogo from "../../assets/logo/google-logo.svg";
import Logo from "../../assets/logo/logo.svg";
import LoginImage from "../../assets/login/login-image.jpg";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router";

import { auth } from "../../firebase";
import supabase from "../../supabase";
import { useDispatch } from "react-redux";
import { updateUser, userType } from "../../features/auth/authSlice";
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const loginWithGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const user: userType = {
        id: result.user.uid,
        email: result.user.email,
        name: result.user.displayName,
        profile_picture_url: result.user.photoURL,
      };

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!data) {
        const { error: insertError } = await supabase
          .from("users")
          .insert([user]);

        if (insertError) {
          console.error("Error inserting user:", insertError);
          return;
        }
      } else if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      dispatch(updateUser(user));
      navigate("/");
    } catch (error: any) {
      console.error("Error during Google Sign-In:", error.message);
    }
  };

  return (
    <div className="h-screen px-4 lg:flex lg:items-center lg:px-0 lg:justify-between overflow-hidden max-h-screen max-w-screen relative">
      <div className="flex flex-col items-center justify-center h-full lg:ps-10 pe-8 lg:items-start xl:ps-40 2xl:ps-60">
        <div className="flex gap-2 items-center">
          <img src={Logo} alt="Task Management Logo" className="w-12" />
          <h1 className="text-3xl font-semibold text-[#7B1984]">TaskBuddy</h1>
        </div>
        <p className="mt-2 text-center text-sm max-w-sm lg:text-start">
          Streamline your workflow and track progress effortlessly with our
          all-in-one task management app.
        </p>
        <div className="flex items-center justify-center mt-8">
          <button
            className="bg-black flex items-center gap-4 px-8 py-3 text-white rounded-2xl hover:bg-gray-800 font-medium cursor-pointer"
            onClick={loginWithGoogleAuth}
          >
            <img src={GoogleLogo} alt="Google Logo" />
            Continue with Google
          </button>
        </div>
      </div>

      <div className="hidden lg:flex">
        <img src={LoginImage} alt="Login Image" />
      </div>

      <div
        className={
          "absolute bottom-[2%] lg:bottom-[50%] left-[50%] lg:left-[unset] lg:right-[12%] lg:translate-x-[0%] translate-x-[-50%] lg:translate-y-[50%] w-48 h-48 lg:w-xl lg:h-[576px] rounded-full border-[#7B1984] border before:content-[''] before:absolute before:w-40 lg:before:w-md before:h-40 lg:before:h-[448px] before:rounded-full before:top-[calc(50%-1px)] before:left-[calc(50%-1px)] before:-translate-x-1/2 before:-translate-y-1/2 before:border-[#7B1984] before:border after:absolute after:w-32 lg:after:w-[336px] after:h-32 lg:after:h-[336px] after:rounded-full after:top-[calc(50%-3px)] after:left-[calc(50%-3px)] after:-translate-x-1/2 after:-translate-y-1/2 after:border-[#7B1984] after:border -z-10"
        }
      ></div>

      <div
        className={
          "absolute top-20 left-0 translate-x-[-60%] w-48 h-48 rounded-full border-[#7B1984] border before:content-[''] before:absolute before:w-40 before:h-40 before:rounded-full before:top-[calc(50%-1px)] before:left-[calc(50%-1px)] before:-translate-x-1/2 before:-translate-y-1/2 before:border-[#7B1984] before:border after:absolute after:w-32 after:h-32 after:rounded-full after:top-[calc(50%-3px)] after:left-[calc(50%-3px)] after:-translate-x-1/2 after:-translate-y-1/2 after:border-[#7B1984] after:border lg:hidden"
        }
      ></div>

      <div
        className={
          "absolute top-0 translate-y-[-50%] right-0 translate-x-[50%] w-48 h-48 rounded-full border-[#7B1984] border before:content-[''] before:absolute before:w-40 before:h-40 before:rounded-full before:top-[calc(50%-1px)] before:left-[calc(50%-1px)] before:-translate-x-1/2 before:-translate-y-1/2 before:border-[#7B1984] before:border after:absolute after:w-32 after:h-32 after:rounded-full after:top-[calc(50%-3px)] after:left-[calc(50%-3px)] after:-translate-x-1/2 after:-translate-y-1/2 after:border-[#7B1984] after:border lg:hidden"
        }
      ></div>
    </div>
  );
}

export default Login;
