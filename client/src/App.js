import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Context
import { AuthContext } from "context/AuthContext";

// Components
import Home from "pages/home/Home";
import Login from "pages/login/Login";
import Profile from "pages/profile/Profile";
import Register from "pages/register/Register";
import ForgotPassword from "pages/forgot-password/ForgotPassword";
import ActivateAccount from "pages/activate-account/ActivateAccount";
import ResetPassword from "pages/reset-password/ResetPassword";

const App = () => {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/profile/:username"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/" /> : <ForgotPassword />}
        />
        <Route
          path="/activate/:token"
          element={user ? <Navigate to="/" /> : <ActivateAccount />}
        />
        <Route
          path="/reset/:token"
          element={user ? <Navigate to="/" /> : <ResetPassword />}
        />
      </Routes>
    </Router>
  );
};

export default App;
