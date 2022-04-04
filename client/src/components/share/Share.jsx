import { useContext, useRef, useState } from "react";
import { api, postApi } from "utility/axios";
import { Link } from "react-router-dom";

// Icons
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

// Contextx
import { AuthContext } from "context/AuthContext";

// Env Varialbes
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

export default function Share() {
  const { user } = useContext(AuthContext);
  const description = useRef();
  const [file, setFile] = useState(null);

  const formHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      userId: user._id,
      description: description.current.value,
    };
    if (file) {
      const data = new FormData();
      const fileName = Date.now() + file.name;
      data.append("name", fileName.trim());
      data.append("file", file);
      console.log(newPost);
      newPost.image = fileName;
      try {
        await api.post("/upload", data);
      } catch (err) {
        console.log(err);
      }
    }
    try {
      postApi.post("/", newPost);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="rounded bg-gray-100 mb-5 mt-2 backdrop-blur">
      <div className="p-2">
        <div className="flex space-x-2">
          <Link className="h-14 w-14" to={`/profile/${user.username}`}>
            <img
              className="rounded-full"
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "person/profile_pic.png"
              }
              alt=""
            />
          </Link>
          <textarea
            placeholder={"What's in your mind, " + user.username + "?"}
            className="rounded w-full h-20 p-2"
            ref={description}
          />
        </div>
        <hr className="my-5 text-gray-300" />
        <form className="flex justify-between" onSubmit={formHandler}>
          <div className="flex mx-2">
            <label
              htmlFor="file"
              className="flex items-center mr-2 cursor-pointer hover:bg-indigo-700 p-2 rounded hover:text-white group duration-200"
            >
              <PermMediaIcon className="mr-1 text-red-700 group-hover:text-white" />
              <span className="shareOptionText">Photo or Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png, .jpeg, .jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
            <div className="flex items-center mr-2 cursor-pointer hover:bg-indigo-700 p-2 rounded hover:text-white group duration-200">
              <LabelIcon className="mr-1 text-blue-700 group-hover:text-white" />
              <span className="shareOptionText">Tag</span>
            </div>
            <div className="flex items-center mr-2 cursor-pointer hover:bg-indigo-700 p-2 rounded hover:text-white group duration-200">
              <RoomIcon className="mr-1 text-green-700 group-hover:text-white" />
              <span className="shareOptionText">Location</span>
            </div>
            <div className="flex items-center mr-2 cursor-pointer hover:bg-indigo-700 p-2 rounded hover:text-white group duration-200">
              <EmojiEmotionsIcon className="mr-1 text-orange-700 group-hover:text-white" />
              <span className="shareOptionText">Feelings</span>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 px-4 py-1 rounded text-white hover:bg-blue-700 duration-200"
          >
            Share
          </button>
        </form>
      </div>
    </div>
  );
}
