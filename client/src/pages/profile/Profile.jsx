import { useEffect, useState } from "react";
import { userApi } from "utility/axios";
import { useParams } from "react-router";

// CSS
import "./profile.css";

// Components
import Topbar from "components/topbar/TopBar";
import LeftBar from "components/leftbar/LeftBar";
import Feed from "components/feed/Feed";
import RightBar from "components/rightbar/RightBar";

// Env Variables
const PF = process.env.REACT_APP_PUBLIC_FOLDER;

const Profile = () => {
  const [user, setUser] = useState({});
  const { username } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userApi.get(`?username=${username}`);
        setUser(res.data);
        console.log("Response - ", res.data);
      } catch (err) {
        console.log(err);
        // window.location.reload();
      }
    };
    fetchUser();
    console.log(username);
  }, [username]);

  return (
    <div className="bg-gradient-to-r from-rose-100 to-teal-100">
      <Topbar />
      <div className="flex">
        <LeftBar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.coverPicture
                    ? PF + user.coverPicture
                    : PF + "post/3.jpeg"
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "person/profile_pic.png"
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.description}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={user.username} />
            <RightBar user={user} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
