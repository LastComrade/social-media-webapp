import { useState, useEffect, useContext } from "react";
import { postApi } from "utility/axios";
import { useLocation } from "react-router-dom";

// CSS
import "./feed.css";

// Components
import Share from "components/share/Share";
import Post from "../post/Post";

// Context
import { AuthContext } from "context/AuthContext";

const Feed = ({ username }) => {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const location = useLocation();
  console.log("Location - ", location)

  useEffect(() => {
    console.log(username);
    try {
      const fetchPosts = async () => {
        try {
          console.log("Username - ", username);
          const res = username
            ? await postApi.get(`/profile/${username}`)
            : await postApi.get(`/timeline`);
          console.log("RES - ", res);
          setPosts(
            res.data.sort((p1, p2) => {
              return new Date(p2.createdAt) - new Date(p1.createdAt);
            })
          );
        } catch (err) {
          console.log(err);
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  }, [username]);

  return (
    <div className="">
      {user.username === username || location.pathname === "/" ? (
        <Share />
      ) : null}
      {posts.map((p, id) => (
        <Post key={id} post={p} />
      ))}
    </div>
  );
};

export default Feed;
