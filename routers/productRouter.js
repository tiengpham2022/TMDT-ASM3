const Router = require("express").Router();
const productController = require("../controllers/productController");
const userAuthi = require("../middleware/userAuth");

//xử lý lưu ảnh
const { upload } = require("../middleware/UploadFile");

//authorization
const authi = require("../middleware/userAuth");

//get all product
Router.get("/allproduct", productController.getAllProduct);

//post add a product -- cần login -- role ["ADMIN"]
Router.post(
  "/",
  userAuthi(["ADMIN"]),
  upload.array("image", 5),
  productController.postAddProduct
);

//get a product -- cần login -- role ["ADMIN"]
Router.get("/:id", userAuthi(["ADMIN"]), productController.getProductEdit);
//edit add a product -- cần login -- role ["ADMIN"]
Router.put("/:id", userAuthi(["ADMIN"]), productController.putEditProduct);

//delete a product -- cần login -- role ["ADMIN"]
Router.delete(
  "/:id",
  userAuthi(["ADMIN"]),
  productController.postDeleteProduct
);

//get one product
Router.get("/detail/:id", productController.getProductDetail);

module.exports = Router;
