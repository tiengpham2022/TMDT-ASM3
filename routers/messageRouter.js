const Router = require("express").Router();
const messageController = require("../controllers/messageControlle");
const userAuthi = require("../middleware/userAuth");

//post a message - không cần login
Router.post("/add-message", messageController.postUserMessage);

//get all message - cần login - role ["ADMIN", "MOD"]
Router.get(
  "/allmessage",
  userAuthi(["ADMIN", "MOD"]),
  messageController.getAllMessage
);

module.exports = Router;
