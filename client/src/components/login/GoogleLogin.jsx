import { useContext } from "react";
import { GoogleLogin, useGoogleLogout } from "react-google-login";
import { authApi } from "utility/axios";
import toast, { Toaster } from "react-hot-toast";

// Icons
import GoogleIcon from "@mui/icons-material/Google";

// Context
import { AuthContext } from "context/AuthContext";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function Login() {
  const { dispatch } = useContext(AuthContext);

  const { signOut } = useGoogleLogout({
    clientId,
    onLogoutSuccess: (res) => {
      return;
    },
    onFailure: (res) => {
      return;
    },
  });

  const onLoginSuccess = async (res) => {
    dispatch({ type: "LOGIN_START" });
    try {
      console.log("Login Success:", res.profileObj);
      console.log("Response - ", res);
      const id_token = res.tokenObj.id_token;
      const serverRes = await authApi.post("/google-login", { id_token });
      console.log("Server Response - ", serverRes);
      dispatch({ type: "LOGIN_SUCCESS", payload: serverRes.data });
      await signOut();
      window.location.href = "/";
    } catch (err) {
      dispatch({ type: "LOGIN_FAILED", payload: err.response.data });
      console.log("Google Login Error - ", err);
    }
  };

  const onLoginFailure = (res) => {
    toast.error("Login Failed");
    console.log("Login Failed:", res);
  };

  return (
    <div>
      <Toaster />
      <GoogleLogin
        clientId={clientId}
        render={(renderProps) => (
          <button
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
            className="w-full flex justify-center bg-red-500 flex item-center border-none px-4 py-2 rounded-lg cursor-pointer text-white shadow-xl hover:shadow-inner duration-200 ease-in-out hover:bg-red-700"
          >
            <GoogleIcon />
            <span>
              {window.location.pathname === "/login"
                ? "Login "
                : window.location.pathname === "/register"
                ? "Register "
                : ""}
              with Google
            </span>
          </button>
        )}
        onSuccess={onLoginSuccess}
        onFailure={onLoginFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={false}
        autoLogin={false}
      />
    </div>
  );
}
export default Login;
