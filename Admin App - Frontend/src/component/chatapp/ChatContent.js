import { useRef, useEffect } from "react";
import styles from "./ChatContent.module.css";
import { ApiMessage, URL_Server } from "../../utils/API";
import UserCard from "./UserCard";
import AdminCard from "./AdminCard";
import { useSelector } from "react-redux";
import useHttp from "../../hook-http/useHttp";
import { getToken } from "../../utils/authi/isAuthi";

const ChatContent = (props) => {
  const user = useSelector((state) => state.login.user);
  const messageRef = useRef();

  //custom hook
  const { isLoading, isError, sendRequest } = useHttp();

  function clickPress(event) {
    if (event.key == "Enter") {
      messageHandle();
    }
  }
  //xử lý gửi tin nhắn
  const messageHandle = () => {
    //1. gửi tin nhắn vào api - post lưu vào database
    //2. emit message
    //3. update vào state

    //1. gửi tin nhắn vào api - post lưu vào database
    //nếu không có tin thì không làm gì
    const message = messageRef.current.value.trim();
    if (!message) {
      return;
    }

    //nếu tin nhắn hợp lệ
    const messageData = {
      message: message,
      roomid: props.roomid,
      isuser: false,
      sender: user && user._id ? user._id : null,
    };

    //cấu hình gửi api
    const option = {
      url: ApiMessage.apiPostMessage,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + getToken(),
      },
      body: messageData,
    };

    //hàm xử lý phản hồi api
    const messageHandle = (resData) => {
      //
      //2. emit vào roomchat
      props.socket.emit("message-admin", messageData);

      //3. update vào state
      props.messageData(messageData);

      //4. xoá input
      messageRef.current.value = "";
    };

    //1. send message api
    sendRequest(option, messageHandle);
  };

  return (
    <div className={styles["container-content"]}>
      <div className={styles.content}>
        {props.content.length > 0 &&
          props.content.map((data) => {
            if (data.isuser) {
              return <UserCard key={data._id}>{data.message}</UserCard>;
            } else {
              return <AdminCard key={data._id}>{data.message}</AdminCard>;
            }
            // return ({data.isuser ? "" : ""})
          })}
      </div>
      <div className={styles["send-container"]}>
        <input onKeyDown={clickPress} ref={messageRef}></input>
        <button onClick={messageHandle}>Send</button>
      </div>
    </div>
  );
};

export default ChatContent;
