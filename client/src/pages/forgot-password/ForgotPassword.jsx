import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { authApi } from "utility/axios";

// Icons
import CircularProgress from "@mui/material/CircularProgress";

export default function ForgotPassword() {
  const email = useRef(null);
  const username = useRef(null);
  const [byEmail, setByEmail] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();
    setIsFetching(true);
    try {
      const data = {};
      if (byEmail) {
        data.email = email.current.value;
        data.username = null;
      } else {
        data.email = null;
        data.username = username.current.value;
      }
      console.log(data);
      const res = await authApi.post("/request-password-reset-link", data);
      toast.success(res.data.message);
      setIsFetching(false);
      console.log(res);
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
              Forgot Password
            </label>
            <div className="flex items-center mt-5 justify-center">
              <div className="w-3/4 rounded flex flex-row justify-between py-3 px-3">
                <div
                  className={`${
                    byEmail
                      ? "bg-gray-300"
                      : "bg-blue-600 text-white duration-200"
                  } rounded cursor-pointer h-10 flex items-center justify-center px-3 w-28`}
                  onClick={() => setByEmail(false)}
                >
                  Username
                </div>
                <div
                  className={`${
                    !byEmail
                      ? "bg-gray-300"
                      : "bg-blue-600 text-white duration-200"
                  } rounded cursor-pointer h-10 flex items-center justify-center px-3 w-28`}
                  onClick={() => setByEmail(true)}
                >
                  Email
                </div>
              </div>
            </div>
            <form onSubmit={forgotPasswordHandler} className="mt-5">
              {byEmail ? (
                <div>
                  <input
                    type="email"
                    required
                    placeholder="Email"
                    ref={email}
                    className="mt-1 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                  />
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    required
                    placeholder="Username"
                    ref={username}
                    className="mt-1 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                  />
                </div>
              )}

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
