import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
import decoded from "jwt-decode";

export const getToken = () => {
  return Cookies.get("jwt_token");
};

const getTimeExpired = () => {
  return Cookies.get("expired");
};

const getNow = () => {
  const now = new Date();
  return now.getTime();
};

//hàm dành cho check các thao tác trong form - cần yc login
export const isLogin = () => {
  //lấy token
  const token = getToken();
  //lấy timeExpired
  const expired = getTimeExpired();
  //time now
  const now = getNow();

  //nếu không có token hoặc hết hạn thì trả về false
  if (!token) {
    return {
      message: "Please Login!",
    };
  }

  if (expired < now) {
    return {
      message: "Token Expired. Please Login Again!",
    };
  }

  return "islogin";
};

//hàm check bảo vệ các router (loader)
export const isLoginLoader = () => {
  //lấy token
  const token = getToken();
  //lấy timeExpired
  const expired = getTimeExpired();
  //time now
  const now = getNow();

  //nếu không có token hoặc hết hạn thì trả về false
  if (!token || expired < now) {
    return redirect("/login");
  }
  const user = decoded(getToken()).user;
  if (user.role !== "ADMIN" && user.role !== "MOD") {
    return redirect("/login");
  }

  return null;
};

//hàm check role (loader)
export const isAdminLoader = () => {
  const user = decoded(getToken()).user;
  if (user.role !== "ADMIN") {
    return redirect("/notpermission");
  }
  return null;
};
