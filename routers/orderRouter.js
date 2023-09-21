const Router = require("express").Router();
const orderController = require("../controllers/orderController");
const userAuthi = require("../middleware/userAuth");

//<<Client>> post add 1 đơn hàng - cần login - các role đều dùng được
Router.post(
  "/add",
  userAuthi(["ADMIN", "MOD", "USER"]),
  orderController.postAddOrder
);

//<<Client>> get tất cả order theo user - cần login - các role đều dùng được - có check đúng user
Router.get(
  "/get",
  userAuthi(["ADMIN", "MOD", "USER"]),
  orderController.getAllOrderUser
);

//<<Admin>> get tất cả order - cần login - role "ADMIN"
Router.get("/allorder", userAuthi(["ADMIN"]), orderController.getAllOrder);

//<<Admin>> get dashBoard info - cần login - role "ADMIN"
Router.get(
  "/dashboard-info",
  userAuthi(["ADMIN"]),
  orderController.getDashboardInfo
);

module.exports = Router;
