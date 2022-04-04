import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useContext } from "react";
import { authApi } from "utility/axios";
import toast, { Toaster } from "react-hot-toast";

// Context
import { AuthContext } from "context/AuthContext";

const appID = process.env.REACT_APP_FACEBOOK_APP_ID;

const Login = () => {
  const { dispatch } = useContext(AuthContext);

  const responseFacebook = async (response) => {
    try {
      dispatch({ type: "LOGIN_START" });
      console.log("We got the response", response);
      const { accessToken, userID } = response;
      console.log("Access Token", accessToken);
      console.log("User ID", userID);
      const serverRes = await authApi.post("/facebook-login", {
        accessToken,
        userID,
      });
      console.log("Server Response - ", serverRes);
      dispatch({ type: "LOGIN_SUCCESS", payload: serverRes.data });
      toast.success("Login Successful");
      window.FB.logout(response.authResponse);
      window.location.href = "/";
    } catch (err) {
      dispatch({ type: "LOGIN_FAILED", payload: err.response.data });
      toast.error("Login Failed");
      console.log(err);
    }
  };

  return (
    <>
      <Toaster />
      <FacebookLogin
        appId={appID}
        autoLoad={false}
        callback={responseFacebook}
        render={(renderProps) => (
          <button
            className="w-full mt-3 flex justify-center bg-blue-500 flex item-center border-none px-4 py-2 rounded-lg cursor-pointer text-white shadow-xl hover:shadow-inner duration-200 ease-in-out hover:bg-blue-700"
            onClick={renderProps.onClick}
          >
            <FacebookIcon />
            {window.location.pathname === "/login"
              ? "Login "
              : "Register "}{" "}
            with Facebook
          </button>
        )}
      />
    </>
  );
};

export default Login;
