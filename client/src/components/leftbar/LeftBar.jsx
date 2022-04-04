import { useState } from "react";

// Dummy data for USER
import { Users } from "../../dummyData";

// Components
import CloseFriend from "components/closeFriend/CloseFriend";

// Icons
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import GroupIcon from "@mui/icons-material/Group";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

const LeftBar = () => {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="w-3/12 sticky min-h-screen">
      <div className="w-full">
        <ul className="">
          <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-4 px-3">
            <RssFeedIcon className="mr-4" />
            <span className="">Feed</span>
          </li>
          <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
            <PersonIcon className="mr-4" />
            <span className="">Profile</span>
          </li>
          <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
            <ChatIcon className="mr-4" />
            <span className="">Chat</span>
          </li>
          {showMore ? (
            <>
              <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
                <PlayCircleFilledWhiteIcon className="mr-4" />
                <span className="">Videos</span>
              </li>
              <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
                <GroupIcon className="mr-4" />
                <span className="">Groups</span>
              </li>
              <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
                <BookmarkIcon className="mr-4" />
                <span className="">Bookmarks</span>
              </li>
              <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
                <HelpOutlineIcon className="mr-4" />
                <span className="">Questions</span>
              </li>
              <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
                <WorkOutlineIcon className="mr-4" />
                <span className="">Jobs</span>
              </li>
              <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
                <EventIcon className="mr-4" />
                <span className="">Events</span>
              </li>
              <li className="hover:bg-indigo-700 hover:text-white cursor-pointer duration-100 py-3 px-3">
                <SchoolIcon className="mr-4" />
                <span className="">Courses</span>
              </li>
            </>
          ) : null}
        </ul>
        <span
          onClick={(e) => setShowMore(!showMore)}
          className="transition ease-in font-semibold cursor-pointer hover:text-indigo-800 duration-100 flex justify-center"
        >
          {showMore ? "Show Less" : "Show More"}
        </span>
        <div className="my-5 flex justify-center">
          <hr className="w-5/6 text-gray-300" />
        </div>
        <ul className="">
          {Users.map((u) => (
            <CloseFriend key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LeftBar;
