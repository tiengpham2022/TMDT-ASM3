const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    roomid: {
      type: String,
      required: true,
    },
    isuser: {
      type: Boolean,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

let Message = mongoose.model("Message", messageSchema);

module.exports = Message;
