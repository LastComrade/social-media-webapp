import { useState, useEffect, useContext } from "react";
import { userApi, postApi } from "utility/axios";
import moment from "moment";
import { Link } from "react-router-dom";

// Icons
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MessageIcon from "@mui/icons-material/Message";
import ShareIcon from "@mui/icons-material/Share";
import SendIcon from "@mui/icons-material/Send";

// Context
import { AuthContext } from "context/AuthContext";

// Env Variables
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Post = ({ post }) => {
  const { user: currentUser } = useContext(AuthContext);
  const [like, setLike] = useState(post.likes.length ? post.likes.length : 0);
  const [isLiked, setIsLiked] = useState(post.likes.includes(currentUser._id));
  const [user, setUser] = useState({});

  useEffect(() => {
    try {
      const fetchUser = async () => {
        // console.log("Post - ", post);
        const res = await userApi.get(`?userId=${post.userId}`);
        console.log("Post user response - ", res);
        setUser(res?.data);
      };
      fetchUser();
    } catch (error) {
      console.log("This right here", error);
    }
  }, [post.userId]);

  const likeHandler = () => {
    try {
      postApi.put(`/${post._id}/like`);
    } catch (error) {
      console.log(error);
    }
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  return (
    <>
      {user ? (
        <div className="py-2 flex items-center justify-center">
          <div className="bg-white w-full rounded-lg py-2 shadow-lg hover:shadow-2xl transition duration-500">
            <div className="flex items-center mb-2 justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  className="flex items-center space-x-4"
                  to={`/profile/${user.username}`}
                >
                  <img
                    className="w-10 rounded-full ml-2 cursor-pointer"
                    src={
                      user.profilePicture
                        ? PF + user.profilePicture
                        : PF + "person/profile_pic.png"
                    }
                    alt={user.username}
                  />
                  <h1 className="capitalize font-semibold">{user.username}</h1>
                </Link>
              </div>
              <span>
                <MoreVertIcon className="cursor-pointer hover:text-gray-900 text-gray-500 duration-200" />
              </span>
            </div>
            <div className="p-3">
              <p>{post.description}</p>
            </div>
            <div className="bg-gray-300">
              <img
                className="mx-auto"
                src={post.image ? PF + post.image : ""}
                alt=""
              />
            </div>
            <div className="flex justify-between items-center px-10 py-3 border-y-2">
              <span className="flex items-center" onClick={likeHandler}>
                <FavoriteIcon
                  className={`${
                    isLiked ? "text-red-500" : "text-gray-500"
                  } cursor-pointer`}
                />
                <span className="ml-1 flex justify-center cursor-pointer">
                  {like}
                </span>
              </span>
              <span>
                <MessageIcon
                  className={`cursor-pointer text-gray-500 hover:text-blue-700 transition duration-200`}
                />
              </span>
              <span>
                <SendIcon
                  className={`cursor-pointer text-gray-500 hover:text-pink-700 transition duration-200`}
                />
              </span>
              <span>
                <ShareIcon
                  className={`cursor-pointer text-gray-500 hover:text-green-700 transition duration-200`}
                />
              </span>
            </div>
            <div className="">
              <div className="flex items-center justify-between px-10 py-3">
                <div className="flex space-x-3 items-center ">
                  <p className="text-sm font-normal text-gray-600 hover:underline">
                    #Tag1
                  </p>
                  <p className="text-sm font-normal text-gray-600 hover:underline">
                    #Tag2
                  </p>
                  <p className="text-sm font-normal text-gray-600 hover:underline">
                    #Tag3
                  </p>
                </div>
                <div>
                  <div className="text-sm font-normal ml-2 flex items-center space-x-2">
                    <p className="font-bold">
                      {moment(post.createdAt).format("MMMM Do YYYY")}
                    </p>
                    <p className="text-xs">
                      {moment(post.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          No user
        </div>
      )}
    </>
  );
};

export default Post;
