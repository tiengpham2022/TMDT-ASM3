import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginActions } from "../../store";

import { ApiUser } from "../../utils/API";
import styles from "./FormLogin.module.css";
import useHttp from "../../hook-http/useHttp";

import Toast from "../../utils/Toast";

const FormLogin = () => {
  const { isLoading, isError, sendRequest } = useHttp();
  //dùng navidate chuyển route
  const navigate = useNavigate();

  //dùng dispatch để chuyển action đến redux
  const dispatch = useDispatch();

  //dùng useRef lấy value input
  const emailRef = useRef();
  const passwordRef = useRef();

  //dùng state valid như bên register
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);
  const [messageError, setMessageError] = useState();

  /////////////////////xử lý đăng nhập/////////////////
  const submitHandle = (e) => {
    e.preventDefault();

    //valid input
    const emailEntered = emailRef.current.value;
    const passwordEntered = passwordRef.current.value;

    if (!emailEntered.trim()) {
      //không được để trống
      setEmailIsValid(false);
      setMessageError("Please input email");
      return;
    } else {
      setEmailIsValid(true);
      setMessageError("");
    }

    if (!passwordEntered.trim()) {
      //pass không được bỏ trống
      setPasswordIsValid(false);
      setMessageError("Please input password");
      return;
    } else if (passwordEntered.trim().length < 8) {
      //dò pass trên 8 ký tự
      setPasswordIsValid(false);
      setMessageError("Password must be from 8 words!");
      //bắt đăng nhập lại (xóa trường Password).
      passwordRef.current.value = "";
      //đúng ra phải dùng useState set twowaybiding để đổi value - nhưng chỗ này dùng ref vẫn tiện
      return;
    } else {
      setPasswordIsValid(true);
      setMessageError("");
    }

    ///////////////valid OK///////////
    //gửi API đến server
    const dataForm = {
      email: emailEntered,
      password: passwordEntered,
    };
    const option = {
      url: ApiUser.apiAdminLogin,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: dataForm,
    };

    //hàm xử lý phản hồi
    const messageResponse = (resData) => {
      console.log(resData);
      //
      dispatch(loginActions.ON_LOGIN(resData.jwt_token));

      navigate("/");
    };

    sendRequest(option, messageResponse);

    //lấy role nhận được khi login
    // const role = jwt_decode(resData.jwt_token).user.role;
    //chuyển trang sang dashboard ("Admin") - chat ("Mod") - err ("user")
    // if (role === "ADMIN") {
    //   navigate("/dashboard");
    // } else if (role === "MOD") {
    //   navigate("/chatapp");
    // } else {
    //   return setMessageError("Not Permission!");
    // }
  };
  return (
    <>
      <form className={styles["form-container"]} onSubmit={submitHandle}>
        <div className={styles.title}>Sign In</div>
        <div className={styles.container}>
          <input
            className={!emailIsValid ? "nonvalid" : null}
            ref={emailRef}
            type="email"
            placeholder="Email"
          ></input>
          <input
            className={!passwordIsValid ? "nonvalid" : null}
            ref={passwordRef}
            type="password"
            placeholder="Password"
          ></input>
        </div>
        {/* thêm trường message báo lỗi */}
        {messageError && (
          <div className={styles["message-err"]}>{messageError}</div>
        )}
        {!messageError && (
          <div className={styles["message-err"]}>{isError ? isError : ""}</div>
        )}
        <button type="submit" className={styles.btn}>
          {isLoading ? "Sending..." : "SIGN IN"}
        </button>
      </form>
      {Toast.container}
    </>
  );
};

export default FormLogin;
