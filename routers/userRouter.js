const userController = require("../controllers/userController");
const Router = require("express").Router();
const userAuthi = require("../middleware/userAuth");

//register - post
Router.post("/register", userController.postUserRegister);

//client - login - post
Router.post("/login", userController.postUserLogin);

//Admin - login - post
Router.post("/login-admin", userController.postAdminLogin);

//get - All User - AUTHI role ["ADMIN"]
Router.get("/alluser", userAuthi(["ADMIN"]), userController.getAllUser);

module.exports = Router;
