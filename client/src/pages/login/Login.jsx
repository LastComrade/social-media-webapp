import { useRef, useContext } from "react";
import { authApi } from "utility/axios";
import { AuthContext } from "context/AuthContext";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import GoogleLogin from "components/login/GoogleLogin";
import FacebookLogin from "components/login/FacebookLogin";

// Icons
import CircularProgress from "@mui/material/CircularProgress";

export default function Login() {
  const email = useRef(null);
  const password = useRef(null);
  const { isFetching, dispatch } = useContext(AuthContext);

  const loginHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await authApi.post("/login", {
        email: email.current.value,
        password: password.current.value,
      });
      toast.success(res.data.message);
      dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      window.location.href = "/";
      return;
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
      dispatch({ type: "LOGIN_FAILURE", payload: error.response.data });
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
              Login
            </label>
            <form onSubmit={loginHandler} className="mt-10">
              <div>
                <input
                  type="email"
                  required
                  placeholder="Email"
                  ref={email}
                  className="mt-1 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
              </div>

              <div className="mt-7">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  minLength="6"
                  ref={password}
                  className="mt-1 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
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
                    "Log In"
                  )}
                </button>
              </div>
              <div className="mt-3 flex">
                <div className="w-full text-right">
                  <Link
                    className="underline text-sm text-gray-600 hover:text-gray-900"
                    to="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <div className="flex mt-5 items-center text-center">
                <hr className="border-gray-300 border-1 w-full rounded-md" />
                <label className="block font-medium text-sm text-gray-600 w-full">
                  Login By
                </label>
                <hr className="border-gray-300 border-1 w-full rounded-md" />
              </div>

              <div className="flex flex-col mt-7 justify-center w-full">
                <GoogleLogin />
                <FacebookLogin />
              </div>

              <div className="mt-7">
                <div className="flex justify-center items-center">
                  <label className="mr-2">Not Registered?</label>
                  <Link
                    to="/register"
                    className=" text-blue-500 transition duration-200 ease-in-out hover:text-blue-800 hover:underline"
                    disabled={isFetching}
                  >
                    Create an Account
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
