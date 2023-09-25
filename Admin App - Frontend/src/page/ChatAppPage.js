import { useRef, useState, useEffect } from "react";
import { BallTriangle } from "react-loading-icons";
import { io } from "socket.io-client";
import { ApiMessage, URL_Server } from "../utils/API";
import styles from "./ChatAppPage.module.css";
import ChatContent from "../component/chatapp/ChatContent";
import { getToken } from "../utils/authi/isAuthi";
import useHttp from "../hook-http/useHttp";

//kết nối socket
const socket = io(URL_Server);

const ChatAppPage = () => {
  const { isLoading, isError, sendRequest } = useHttp();
  //tạo state chứa all messages - khi thay đổi sẽ thay đổi tất cả state dưới
  const [messageData, setMessageData] = useState([]);
  //State chứa content của roomid đang chat
  const [messageDataCurrent, setMessageDataCurrent] = useState([]);

  //tạo state chứa mảng room id hiện có
  const [roomidArray, setRoomidArray] = useState([]);

  //roomid đang chat
  const [roomidCurrent, setRoomidCurrent] = useState("");

  //1. nhận tin từ socket
  //2. cập nhật tin vào mảng messageData

  //load messages từ database - lần đầu tải
  useEffect(() => {
    const option = {
      url: ApiMessage.apiGetAllMessage,
      headers: {
        authorization: "Bearer " + getToken(),
      },
    };

    //gửi api
    sendRequest(option, setMessageData);
  }, []);

  //mảng chứa roomidArray khi lần đầu load - không lấy trùng
  useEffect(() => {
    if (messageData.length > 0) {
      const roomIdArray = [];
      for (let i = 0; i < messageData.length; i++) {
        //nếu id chưa có, thì push vào mảng - nếu có rồi bỏ qua
        if (roomIdArray.indexOf(messageData[i].roomid) === -1) {
          roomIdArray.push(messageData[i].roomid);
        }
      }
      setRoomidArray(roomIdArray);
    }
  }, [messageData]);
  //khi click vào room - chuyển khung chat sang user tương ứng
  const changeRoomHandle = (roomid) => {
    setRoomidCurrent(roomid);
  };
  //khi roomidCurrent thay đổi -> cập nhật lại content message
  useEffect(() => {
    const messageDataFilter = messageData.filter(
      (data) => data.roomid === roomidCurrent
    );
    // lọc mảng lấy content theo roomid
    setMessageDataCurrent(messageDataFilter);
  }, [roomidCurrent]);

  //nhận tin từ user
  useEffect(() => {
    socket.on("server-send-message-user", (data) => {
      //push data vào messageData
      setMessageData((prev) => [...prev, data]);
      console.log(data);

      //cập nhật lại state roomidCurrent để update message
      setRoomidCurrent((prev) => prev);
    });
  }, []);

  //khi nhận tin - messageData thay đổi -> cập nhật lại state content message
  useEffect(() => {
    const messageDataFilter = messageData.filter(
      (data) => data.roomid === roomidCurrent
    );
    // lọc mảng lấy content theo roomid
    setMessageDataCurrent(messageDataFilter);
  }, [messageData]);

  const messageDataHandle = (messageData) => {
    //update data vào state
    setMessageData((prev) => [...prev, messageData]);
  };

  return (
    <div className={styles.containers}>
      <div className={styles.container}>
        <div className={styles["menu-chat"]}>
          <div className={styles.items}>
            <input
              className={styles.search}
              placeholder="Search Contact"
            ></input>
          </div>
          <div className={styles["side-bar"]}>
            {isLoading && (
              <div className={styles["message-error"]}>
                <BallTriangle stroke="red" />
              </div>
            )}
            {!isLoading && isError && (
              <div className={styles["message-error"]}>{isError}</div>
            )}
            {roomidArray.length > 0 &&
              roomidArray.map((id) => {
                return (
                  <div
                    onClick={() => changeRoomHandle(id)}
                    className={styles.roomid}
                  >
                    {id}
                  </div>
                );
              })}
          </div>
        </div>
        {messageDataCurrent && (
          <ChatContent
            socket={socket}
            roomid={roomidCurrent}
            content={messageDataCurrent}
            messageData={messageDataHandle}
          />
        )}
      </div>
    </div>
  );
};

export default ChatAppPage;
