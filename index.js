const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { createServer } = require("http");

//dùng .env lưu các key
const dotenv = require("dotenv");
dotenv.config();

const app = express();

//set-headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  next();
});

//dùng cors - chạy nhiều port
app.use(cors());

//tạo static file
app.use("/public", express.static(path.join(__dirname, "public")));

//đọc req.body
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

//lấy router
const userRouter = require("./routers/userRouter");
const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const messageRouter = require("./routers/messageRouter");

//dùng router
app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/order", orderRouter);

app.use("/api/message", messageRouter);

//Connect Mongoose Database - lấy url từ .env
mongoose
  .connect(process.env.URL_MONGOOSE)
  .then(() => {
    console.log("Mongoose is connecting ...");

    //SERVER chạy port 5000
    const PORT = process.env.PORT || 5000;
    const httpServer = http.createServer(app);
    httpServer.listen(PORT);
    // const server = app.listen(PORT, () => console.log("Server is running ..."));

    //connect socket-client
    const io = require("./socket").init(httpServer);

    //lắng nghe socket khi client connect
    io.on("connection", (socket) => {
      console.log(socket.id);
      //thông báo lại cho user id của socket
      socket.emit("user-connect", socket.id);

      //nhận tin từ user
      socket.on("message-user", (data) => {
        //cho user join vào room được gửi kèm
        socket.join(data.roomid);

        //server gửi tin của user tới admin
        io.sockets.emit("server-send-message-user", data);
      });

      //nhận tin từ admin-support
      socket.on("message-admin", (data) => {
        console.log("message-admin", data);
        //server gửi tin nhắn đến room - trong data có id room - gửi vào đúng room admin muốn gửi
        io.to(data.roomid).emit("server-send-message-admin", data);
      });

      // socket.on("disconnect", (reason) => {
      //   console.log("client disconnected! " + socket.id);
      // });
    });
  })
  .catch((err) => console.log(err));
