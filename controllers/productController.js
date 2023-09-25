const fs = require("fs");
const Product = require("../model/productModel");
const path = require("path");

const multer = require("multer");
const upload = require("../middleware/UploadFile");
const env = require("dotenv");

const productController = {
  //////////////////////////////4. (Client) Xem các thông tin ở trang chủ//////////////////////
  /////////////////////////////10.1 (Admin) Xem danh sách các sản phẩm/////////////
  //get - allproducts
  getAllProduct: async (req, res) => {
    try {
      //lấy tất cả sản phẩm từ product - xếp theo sản phẩm mới nhất
      const allProducts = await Product.find().sort({ createdAt: -1 });
      // if (allProducts.length === 0) {
      //   return res.status(400).json({ message: "no" });
      // }

      res.status(200).json(allProducts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //////////////////////5. (Client) Xem thông tin cụ thể của một sản phẩm/////////////////
  //truyền id này vào API và lấy được dữ liệu tương ứng.
  //API cũng sẽ cần trả về danh sách các sản phẩm tương ứng để bạn hiển thị ở phía dưới.
  //get - one product
  getProductDetail: async (req, res) => {
    try {
      //id
      const idCurrent = req.params.id;

      ///////////tìm sản phẩm chính theo id//////////////
      const productCurrent = await Product.findById(idCurrent);

      //nếu không có
      if (!productCurrent) {
        res.status(400).json({ message: "Product not found!" });
      }

      //////////tìm các sản phẩm liên quan//////////////

      const productRelatedTotal = await Product.find({
        category: productCurrent.category,
      });
      //ngoại trừ sản phẩm chính - lọc lại, bỏ sản phẩm có id là id sản phẩm chính
      const productRelated = productRelatedTotal.filter(
        (e) => !e._id.equals(productCurrent._id)
      );

      res
        .status(200)
        .json({ product: productCurrent, related: productRelated });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  /////////////////////////////14. (Nâng cao) (Admin) Tạo mới một sản phẩm///////
  //add product
  postAddProduct: async (req, res) => {
    try {
      ///////data đến đã được đọc thông qua multer
      //đồng thời file cũng đã được ghi vào server
      //1. valid data gửi đến - chỉ cần valid không thành công thì xoá file vừa add vào
      const data = {
        name: req.body.name ? req.body.name.trim() : "",
        category: req.body.category ? req.body.category.trim() : "",
        price: req.body.price,
        short_desc: req.body.short_desc ? req.body.short_desc.trim() : "",
        long_desc: req.body.long_desc ? req.body.long_desc.trim() : "",
        count: req.body.count,
        // files: req.files,
      };

      //valid
      if (!data.name) {
        return res.status(400).json({ message: "Please input product name!" });
      }
      if (!data.category) {
        return res
          .status(400)
          .json({ message: "Please input product category!" });
      }
      if (!data.price) {
        return res.status(400).json({ message: "Please input product price!" });
      }
      if (!data.short_desc) {
        return res
          .status(400)
          .json({ message: "Please input product short description!" });
      }
      if (!data.long_desc) {
        return res
          .status(400)
          .json({ message: "Please input product long description!" });
      }
      if (!data.count) {
        return res.status(400).json({ message: "Please input product count!" });
      }

      console.log("ok");
      //2. valid data ok hết mới xử lý lưu ảnh
      //////////dùng upload để lưu vào server - đã cấu hình storage và name ở file riêng///////
      // upload.single()(req, res, function (err) {
      //   if (err instanceof multer.MulterError) {
      //     // A Multer error occurred when uploading.
      //     return res.status(400).json({ message: err });
      //   } else if (err) {
      //     // An unknown error occurred when uploading.
      //     return res.status(400).json({ message: err });
      //   }

      //   // Everything went fine.
      // });

      //lưu ảnh thành công thì lưu vào data base

      //nếu upload lên host thì dùng hostlink
      // const hostLink = req.protocol + "://" + req.hostname;

      //nếu localhost thì dùng
      const hostLink = `http://localhost:${process.env.PORT || 5000}/`;
      //thêm các ảnh vào dataform
      for (let i = 0; i < req.files.length; i++) {
        data[`img${i + 1}`] = hostLink + req.files[i].path.replace(`\\`, "/");
      }

      //thêm vào database
      const productNew = new Product(data);
      const newProduct = await productNew.save();

      res.status(200).json({ message: "Successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  /////////////////////////////15. (Nâng cao) (Admin) Chỉnh sửa thông tin hoặc xóa sản phẩm/////////////
  //edit product
  //Admin sẽ không chỉnh sửa danh sách hình ảnh của các sản phẩm.
  //không được xóa dữ liệu đó đi và phải sử dụng các hàm Update cho việc cập nhật dữ liệu.
  //tìm 1 sản phẩm lấy thông tin ban đầu
  getProductEdit: async (req, res) => {
    try {
      //id
      const idCurrent = req.params.id;

      ///////////tìm sản phẩm chính theo id//////////////
      const productCurrent = await Product.findById(idCurrent);

      //nếu không có
      if (!productCurrent) {
        res.status(400).json({ message: "Product not found!" });
      }

      res.status(200).json(productCurrent);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  putEditProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      //tìm sản phẩm muốn update theo id
      const productCurrent = await Product.findById(productId);

      //nếu sản phẩm không tồn tại báo lỗi
      if (!productCurrent) {
        return res.status(400).json({ message: "ID Product not found!" });
      }

      const dataForm = {
        name: req.body.name ? req.body.name.trim() : "",
        category: req.body.category ? req.body.category.trim() : "",
        price: req.body.price,
        short_desc: req.body.short_desc ? req.body.short_desc.trim() : "",
        long_desc: req.body.long_desc ? req.body.long_desc.trim() : "",
        count: req.body.count,
      };
      //valid - giống add product
      if (!dataForm.name) {
        return res.status(400).json({ message: "Please input product name!" });
      }
      if (!dataForm.category) {
        return res
          .status(400)
          .json({ message: "Please input product category!" });
      }
      if (!dataForm.price) {
        return res.status(400).json({ message: "Please input product price!" });
      }
      if (!dataForm.short_desc) {
        return res
          .status(400)
          .json({ message: "Please input product short description!" });
      }
      if (!dataForm.long_desc) {
        return res
          .status(400)
          .json({ message: "Please input product long description!" });
      }
      if (!dataForm.count) {
        return res.status(400).json({ message: "Please input product count!" });
      }

      //valid ok
      //update sản phẩm
      await productCurrent.updateOne(dataForm);
      res.status(200).json({ message: "Successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  /////////////////////////////15. (Nâng cao) (Admin) Chỉnh sửa thông tin hoặc xóa sản phẩm/////////////
  //remove product
  //thực hiện thao tác cập nhật cơ sở dữ liệu thông qua API.
  //API để xóa sản phẩm sẽ cần sử dụng Method DELETE.
  postDeleteProduct: async (req, res) => {
    try {
      const productId = req.params.id;

      //tìm sản phẩm muốn xoá theo id
      const productCurrent = await Product.findById(productId);

      //nếu sản phẩm không tồn tại báo lỗi
      if (!productCurrent) {
        return res.status(400).json({ message: "ID Product not found!" });
      }

      //xoá sản phẩm
      await Product.findByIdAndRemove(productId);

      //xóa image trong server
      //hàm xoá ảnh
      const clearImage = (linkfile) => {
        //linkfile có dạng: http://localhost:5000/public/images/3c224be0-9d7f-4190-a484-e483bb798010_DSC05905.JPG

        //nếu ảnh nào có chứa localhost:5000 (tức là được lưu vào server mới xoá)
        if (linkfile.includes("localhost:5000")) {
          //cắt lấy path để xoá ảnh
          const filepath = "public/images/" + linkfile.split("images/")[1];

          //xoá file
          fs.unlink(filepath, (err) => console.log(err));
        }
      };

      //xoá ảnh nếu có
      if (productCurrent.img1) {
        clearImage(productCurrent.img1);
      }
      if (productCurrent.img2) {
        clearImage(productCurrent.img2);
      }
      if (productCurrent.img3) {
        clearImage(productCurrent.img3);
      }
      if (productCurrent.img4) {
        clearImage(productCurrent.img4);
      }

      res.status(200).json({ message: "Successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = productController;
