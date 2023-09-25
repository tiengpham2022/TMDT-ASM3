import { createSlice, configureStore } from "@reduxjs/toolkit";

import { getToken } from "../utils/authi/isAuthi";
import jwt_decode from "jwt-decode";
import Cookies from "js-cookie";

////////////////login///////////////

//set init state
//lấy từ cookies
const jwt_token = getToken();
const initialStateLogin = {
  isLogin: jwt_token ? true : false,
  user: jwt_token ? jwt_decode(jwt_token).user : "",
  role: jwt_token ? jwt_decode(jwt_token).role : "",
};

//set Slice

const loginSlice = createSlice({
  name: "login",
  initialState: initialStateLogin,
  reducers: {
    ON_LOGIN: (state, actions) => {
      const decoded = jwt_decode(actions.payload);

      //lưu state
      state.isLogin = true;
      state.user = decoded.user;
      state.role = decoded.role;

      //lưu vào cookies
      Cookies.set("jwt_token", actions.payload);

      //lưu thời gian hết hạn vào cookie - hạn jwt 1h
      const expired = new Date().getTime() + 60 * 60 * 1000;
      Cookies.set("expired", expired);
    },
    ON_LOGOUT: (state, actions) => {
      //lưu state
      state.isLogin = false;
      state.user = "";
      state.role = "";

      //remove cookies
      Cookies.remove("jwt_token");
      Cookies.remove("expired");
    },
  },
});

//dùng configureStore thay cho createStore
const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
  },
});

/////xuất action
export const loginActions = loginSlice.actions;

export default store;
