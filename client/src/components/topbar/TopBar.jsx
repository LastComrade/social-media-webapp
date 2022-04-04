// Hooks
import { useContext } from "react";
import { Link } from "react-router-dom";
import { authApi } from "utility/axios";

// Icons
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

// Context
import { AuthContext } from "context/AuthContext";

// Env Variables
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const TopBar = () => {
  const { user, dispatch } = useContext(AuthContext);

  const logoutHandler = async () => {
    dispatch({ type: "LOGOUT" });
    try {
      await authApi.get("/logout");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-700 via-gray-900 to-black sticky top-0 z-10 flex justify-between">
      <div className="mx-3 my-auto">
        <Link to="/">
          <span className="text-white font-semibold text-2xl">Social Platform</span>
        </Link>
      </div>
      <div className="flex justify-center w-1/2 py-1">
        <div className="flex bg-white mx-10 px-3 w-1/2 rounded">
          <input
            placeholder="Search for friends, posts or videos"
            className="px-1 w-full outline-none group"
          />
          <SearchOutlinedIcon className="my-auto cursor-pointer text-gray-500 group-active:text-blue-900 hover:text-blue-900" />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex text-white items-center">
          <div className="mx-2">
            <Link to="/" className="duration-200 px-3 py-4 cursor-pointer">
              Homepage
            </Link>
            <Link to="/" className="duration-200 px-3 py-4 cursor-pointer">
              Timeline
            </Link>
          </div>
          <div className="flex mx-1">
            <div className="mr-2 cursor-pointer relative">
              <PersonIcon />
              <span className="w-3 h-3 bg-red-500 rounded-full text-white absolute -right-1 p-2 -top-1.5 flex items-center justify-center text-xs">
                1
              </span>
            </div>
            <div className="mr-2 cursor-pointer relative">
              <ChatIcon />
              <span className="w-3 h-3 bg-red-500 rounded-full text-white absolute -right-1 p-2 -top-1.5 flex items-center justify-center text-xs">
                2
              </span>
            </div>
            <div className="mr-2 cursor-pointer relative">
              <NotificationsIcon />
              <span className="w-3 h-3 bg-red-500 rounded-full text-white absolute -right-1 p-2 -top-1.5 flex items-center justify-center text-xs">
                1
              </span>
            </div>
          </div>
          <Link className="mx-5 py-1.5" to={`/profile/${user.username}`}>
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "person/profile_pic.png"
              }
              alt=""
              className="w-10 h-10 rounded-full mx-3 object-fit cursor-pointer"
            />
          </Link>
          <div className="cursor-pointer mr-5">
            <LogoutIcon onClick={logoutHandler} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
