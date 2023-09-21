const Message = require("../model/messageModel");
const User = require("../model/userModel");

const messageController = {
  //sendmessage
  postUserMessage: async (req, res) => {
    try {
      //lưu tin dưới dạng sau:
      const data = {
        message: req.body.message,
        roomid: req.body.roomid,
        isuser: req.body.isuser,
        sender: req.body.sender ? req.body.sender : null,
      };

      console.log(data);
      //thêm vào db
      const messageNew = new Message(data);
      await messageNew.save();

      res.status(200).json({ message: "Add Message Success!" });
    } catch (err) {
      console.log(err);
    }
  },

  //getAllMessage - dành cho admin load data ban đầu
  getAllMessage: async (req, res) => {
    try {
      const allMessage = await Message.find().sort({ createAt: 1 });
      res.status(200).json(allMessage);
    } catch (err) {
      console.log(err);
    }
  },
};

module.exports = messageController;
