const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isFetching: true,
        error: false,
        accessToken: null,
      };
    case "LOGIN_SUCCESS":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem(
        "accessToken",
        JSON.stringify(action.payload.accessToken)
      );
      return {
        user: action.payload.user,
        isFetching: false,
        error: false,
        accessToken: action.payload.accessToken,
      };
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      return {
        user: null,
        isFetching: false,
        error: false,
        accessToken: null,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isFetching: false,
        error: action.payload,
        accessToken: null,
      };
    case "FOLLOW":
      const newState = {
        ...state,
        user: {
          ...state.user,
          following: [...state.user.following, action.payload],
        },
      };
      localStorage.setItem("user", JSON.stringify(newState.user));
      return newState;

    case "UNFOLLOW":
      const newState2 = {
        ...state,
        user: {
          ...state.user,
          following: state.user.following.filter(
            (following) => following !== action.payload
          ),
        },
      };
      localStorage.setItem("user", JSON.stringify(newState2.user));
      return newState2;
    default:
      return state;
  }
};

export default AuthReducer;
