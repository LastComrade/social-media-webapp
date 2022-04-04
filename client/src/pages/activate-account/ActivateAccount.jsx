import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { authApi } from "utility/axios";

// Icons
import CircularProgress from "@mui/material/CircularProgress";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

const ActivateAccount = () => {
  const params = useParams();

  const [counter, setCounter] = useState(3);
  const [activate, setActivate] = useState(1);
  const [userActivated, setUserActivated] = useState(false);
  const token = params.token;

  useEffect(() => {
    const activateAccount = async () => {
      try {
        if (!userActivated) {
          const res = await authApi.post("/activate-account", { token });
          console.log(res);
          setUserActivated(true);
        }
        setActivate(2);
        setInterval(() => {
          setCounter(counter - 1);
          if (counter <= 1) {
            clearInterval();
            window.location.href = "/login";
            return;
          }
        }, 1000);
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 400) {
          setActivate(3);
          setInterval(() => {
            setCounter(counter - 1);
            if (counter <= 1) {
              clearInterval();
              window.location.href = "/login";
              return;
            }
          }, 1000);
        } else {
          setActivate(4);
        }
        console.log("Activation Error - ", err.response);
      }
    };
    activateAccount();
  }, [counter, token, userActivated]);

  const renderActivateCard = () => {
    if (activate === 1) {
      return (
        <>
          <span className="mb-3 text-lg">Account activation is in process</span>
          <CircularProgress />
        </>
      );
    } else if (activate === 2) {
      return (
        <>
          <div className="bg-green-600 text-white rounded-full p-1">
            <DoneIcon />
          </div>
          <span className="block my-3 text-lg text-center">
            Account Activated Successfully!
          </span>
          <span className="text-xs">
            You will be redirected to login page in...{counter}
          </span>
        </>
      );
    } else if (activate === 3) {
      return (
        <>
          <span>Account is already activated</span>
          <div className="bg-green-600 text-white rounded-full my-3 p-1">
            <DoneIcon />
          </div>
          <span className="text-xs">
            You will be redirected to login page in...{counter}
          </span>
        </>
      );
    } else if (activate === 4) {
      return (
        <>
          <span className="mb-3">
            Account can't be activated. Please try later
          </span>
          <div className="bg-red-500 text-white rounded-full p-1">
            <CloseIcon />
          </div>
        </>
      );
    }
  };

  return (
    <div className="relative min-h-screen  flex flex-col sm:justify-center items-center bg-gray-100 ">
      <div className="relative sm:max-w-sm w-full">
        <div className="card bg-blue-400 shadow-lg  w-full h-full rounded-3xl absolute  transform -rotate-6"></div>
        <div className="card bg-red-400 shadow-lg  w-full h-full rounded-3xl absolute  transform rotate-6"></div>
        <div className="relative flex flex-col items-center justify-center h-80 w-full rounded-3xl  px-6 py-4 bg-gray-100 shadow-md">
          {renderActivateCard()}
        </div>
      </div>
    </div>
  );
};

export default ActivateAccount;
