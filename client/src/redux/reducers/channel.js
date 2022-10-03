const initialState = {
  id: null,
  isAuth: false,
  name: null,
  email: null,
  image: null,
  isLogin: false
};

const channelReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CHANNEL_INFO":
      return {...state, ...action.payload};
    case "SET_AUTH":
      return { ...state, ...action.payload };
      case "SET_LOGIN":
        return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default channelReducer;
