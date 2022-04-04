import { useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { authApi } from "utility/axios";

// Icons
import CircularProgress from "@mui/material/CircularProgress";

export default function ResetPassword() {
  const params = useParams();
  const token = params.token;

  const password = useRef(null);
  const confirmPassword = useRef(null);
  const [isFetching, setIsFetching] = useState(false);

  const resetPasswordHandler = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      if (password.current.value !== confirmPassword.current.value) {
        password.current.setCustomValidity("Passwords don't match");
        setIsFetching(false);
      } else {
        const newPassword = password.current.value;
        const res = await authApi.post("/reset-password", {
          newPassword,
          token,
        });
        toast.success(res.data.message);
        setIsFetching(false);
      }
    } catch (err) {
      toast.error(err.response.data.message);
      console.log(err);
      setIsFetching(false);
    }
  };

  return (
    <div className="font-sans">
      <Toaster />
      <div className="relative min-h-screen flex flex-col sm:justify-center items-center bg-gray-100 ">
        <div className="relative sm:max-w-sm w-full">
          <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
          <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
          <div className="relative w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
            <label
              htmlFor="title"
              className="block mt-3 text-xl text-gray-700 text-center"
            >
              Reset Password
            </label>
            <form onSubmit={resetPasswordHandler} className="mt-5">
              <div>
                <input
                  type="password"
                  required
                  placeholder="New Password"
                  ref={password}
                  className="mt-2 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
                <input
                  type="password"
                  required
                  placeholder="Confirm New Password"
                  ref={confirmPassword}
                  className="mt-2 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
              </div>

              <div className="mt-7">
                <button
                  disabled={isFetching}
                  type="submit"
                  className="bg-blue-500 w-full py-3 rounded-lg text-white shadow-xl hover:shadow-inner duration-200 ease-in-out hover:bg-blue-700"
                >
                  {isFetching ? (
                    <CircularProgress color="inherit" size="30px" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
            <div className="mt-7">
              <div className="flex justify-evenly items-center">
                <Link
                  to="/login"
                  className=" text-blue-500 transition duration-200 ease-in-out hover:text-blue-800 hover:underline"
                  disabled={isFetching}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className=" text-blue-500 transition duration-200 ease-in-out hover:text-blue-800 hover:underline"
                  disabled={isFetching}
                >
                  Create an Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
