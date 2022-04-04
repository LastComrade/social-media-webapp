import { useEffect, useState, useContext } from "react";
import { userApi } from "utility/axios";
import { Link } from "react-router-dom";

// CSS
import "./rightbar.css";

// Icons
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import CircularProgress from "@mui/material/CircularProgress";

// Contexts
import { AuthContext } from "context/AuthContext";

// Env variables
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Rightbar({ user }) {
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [friends, setFriends] = useState([]);
  const [followed, setFollowed] = useState(
    currentUser.following.includes(user?.id)
  );
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await userApi.get(`/friends/${user.username}`);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    user?.username ? getFriends() : setFriends([]);
  }, [user?.username]);

  useEffect(() => {
    setFollowed(currentUser.following.includes(user?._id));
  }, [currentUser, user?._id]);

  const followHandler = async () => {
    setLoader(true);
    try {
      if (followed) {
        await userApi.put(`/${user._id}/unfollow`);
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await userApi.put(`/${user._id}/follow`);
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
      setLoader(false);
    } catch (err) {
      console.log(err);
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="flex items-center">
          <img className="h-12 w-12" src={PF + "gift.png"} alt="" />
          <span className="font-normal">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img
          className="mt-5 rounded-lg w-1/2"
          src={PF + "hbd-balloons.jpeg"}
          alt=""
        />
        <h4 className="text-xl font-bold mt-3">Online Friends</h4>
        {/* <ul className="rightbarFriendList">
          {friends.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul> */}
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username ? (
          <button
            className={`p-2 flex items-center justify-center w-1/2 rounded-lg ${
              !followed
                ? "text-black bg-white border-2 border-blue-500"
                : "bg-blue-700 text-white border-2 border-transparent"
            }`}
            onClick={followHandler}
          >
            {followed ? (
              <>
                {loader ? (
                  <CircularProgress size={25} />
                ) : (
                  <span>
                    Unfollow <PersonRemoveAlt1Icon />
                  </span>
                )}
              </>
            ) : (
              <>
                {loader ? (
                  <CircularProgress size={25} />
                ) : (
                  <span>
                    Follow <PersonAddAlt1Icon />
                  </span>
                )}
              </>
            )}
          </button>
        ) : null}
        <h4 className="mt-3 text-xl font-bold">User information</h4>
        <div className="">
          <div className="mb-2">
            <span className="text-gray-600">City:</span>
            <span className="ml-1">{user.city}</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-600">From:</span>
            <span className="ml-1">{user.from}</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-600">Relationship:</span>
            <span className="ml-1">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                ? "Married"
                : "-"}
            </span>
          </div>
        </div>
        <h4 className="mt-3 text-xl font-bold">User friends</h4>
        <div className="flex gap-3">
          {friends.map((friend, key) => (
            <Link key={key} to={`/profile/${friend.username}`}>
              <div className="">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/profile_pic.png"
                  }
                  alt=""
                  className="h-28 w-28 rounded object-cover"
                />
                <span className="flex justify-center w-full">
                  {friend.username.length > 13
                    ? friend.username.substr(0, 13) + "..."
                    : friend.username}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="w-2/6 pl-5">
      <div className="w-full">{user ? <ProfileRightbar /> : <HomeRightbar />}</div>
    </div>
  );
}
