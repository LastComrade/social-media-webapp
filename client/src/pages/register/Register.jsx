import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { authApi } from "utility/axios";
import toast, { Toaster } from "react-hot-toast";
import GoogleLogin from "components/login/GoogleLogin";
import FacebookLogin from "components/login/FacebookLogin";

// Icons
import CircularProgress from "@mui/material/CircularProgress";

import "./register.css";

const Register = () => {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const [isFetching, setIsFetching] = useState(false);

  const registerHandler = async (e) => {
    e.preventDefault();
    console.log(password.current.value);
    console.log(confirmPassword.current.value);
    if (password.current.value !== confirmPassword.current.value) {
      password.current.setCustomValidity("Passwords don't match");
    } else {
      setIsFetching(true);
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        const res = await authApi.post(
          "http://localhost:5000/api/auth/register",
          user
        );
        console.log("Response - ", res);
        toast.success(res.data.message);
        username.current.value = "";
        email.current.value = "";
        password.current.value = "";
        confirmPassword.current.value = "";
        setIsFetching(false);
      } catch (err) {
        console.log(err.response.data);
        toast.error(err.response.data.message);
        setIsFetching(false);
      }
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
              Register
            </label>
            <form onSubmit={registerHandler} className="mt-10">
              <div>
                <input
                  type="text"
                  required
                  placeholder="Username"
                  ref={username}
                  className="mt-1 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
              </div>
              <div className="mt-3">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  ref={email}
                  className="px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
              </div>

              <div className="mt-3">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  minLength="6"
                  ref={password}
                  className="mt-1 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
              </div>
              <div className="mt-3">
                <input
                  type="password"
                  required
                  placeholder="Confirm Password"
                  minLength="6"
                  ref={confirmPassword}
                  className="mt-1 px-3 block w-full border-none bg-gray-100 h-11 rounded shadow-lg hover:bg-blue-100 focus:bg-blue-100 focus:ring-0"
                />
              </div>

              <div className="mt-3">
                <button
                  disabled={isFetching}
                  type="submit"
                  className="bg-blue-500 w-full py-3 rounded-lg text-white shadow-xl hover:shadow-inner duration-200 ease-in-out hover:bg-blue-700"
                >
                  {isFetching ? (
                    <CircularProgress color="inherit" size="30px" />
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
              <div className="flex mt-5 items-center text-center">
                <hr className="border-gray-300 border-1 w-full rounded-md" />
                <label className="block font-medium text-sm text-gray-600 w-full">
                  Register By
                </label>
                <hr className="border-gray-300 border-1 w-full rounded-md" />
              </div>

              <div className="flex flex-col mt-7 justify-center w-full">
                <GoogleLogin />
                <FacebookLogin />
              </div>

              <div className="mt-7">
                <div className="flex justify-center items-center">
                  <label className="mr-2">Already a user?</label>
                  <Link
                    to="/login"
                    className=" text-blue-500 transition duration-200 ease-in-out hover:text-blue-800 hover:underline"
                    disabled={isFetching}
                  >
                    Login
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
