const Order = require("../model/orderModel");
const Product = require("../model/productModel");
const User = require("../model/userModel");
const jwt_decode = require("jwt-decode");

/////////////////setup nodemailer và sendgridTransport
// const nodemailer = require("nodemailer");
// const sendgridTransport = require("nodemailer-sendgrid-transport");
// const transporter = nodemailer.createTransport(
//   sendgridTransport({
//     auth: {
//       api_key:
//         "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",
//     },
//   })
// );

//dùng cái khác thay thế
const sendMail = require("../util/mail");

const orderController = {
  ////////////////////////6. (Client) Chức năng đặt hàng/////////////////////
  //POST 1 đơn hàng
  postAddOrder: async (req, res) => {
    try {
      //valid data - sẽ còn làm ở phần số lượng
      const data = {
        fullname: req.body.fullname ? req.body.fullname.trim() : "",
        email: req.body.email ? req.body.email.trim() : "",
        phone: req.body.phone ? req.body.phone.trim() : "",
        address: req.body.address ? req.body.address.trim() : "",
        total: req.body.total,
        user: req.body.userCurrent,
        products: req.body.products,
        delivery: "Waiting for progressing",
        status: "waiting for pay",
      };

      //valid data
      if (!data.fullname) {
        return res.status(400).json({ message: "Please Input Your Fullname!" });
      }
      if (!data.email) {
        return res.status(400).json({ message: "Please Input Your Email!" });
      }
      if (!data.phone) {
        return res.status(400).json({ message: "Please Input Your Phone!" });
      }
      if (!data.address) {
        return res.status(400).json({ message: "Please Input Your Address!" });
      }
      // nếu idUser gửi kèm form data không cùng với tk đăng nhập, báo lỗi
      if (!req.body.user.equals(data.user)) {
        return res
          .status(400)
          .json({ message: "Please Use The Sample Account!" });
      }
      if (!data.products.length === 0) {
        return res.status(400).json({ message: "Please Input Your Product!" });
      }

      ////check xem còn hàng (count >= ) hay không////

      //tính toán lại tổng tiền - vì không nên lấy tổng tiền từ client
      const allProduct = await Product.find();
      let totalReCal = 0;

      const isCheckCount = [];
      const productSendMail = [];
      //duyệt qua mảng sản phẩm user mua - lấy giá * quantity - so sánh giá user gửi kèm form
      data.products.forEach((el) => {
        const index = allProduct.findIndex((e) => e._id.equals(el.product));
        const price = allProduct[index].price;

        //tổng tiền tính toán lại
        totalReCal = totalReCal + price * el.quantity;

        //check count - nếu số lượng không đủ - thêm vào mảng gửi phản hồi
        if (el.quantity > allProduct[index].count) {
          const check = {
            name: allProduct[index].name,
            count: allProduct[index].count,
          };
          isCheckCount.push(check);
        }
        const item = {
          product: allProduct[index],
          quantity: el.quantity,
        };
        productSendMail.push(item);
      });
      //nếu isCheckCount có item thì báo không đủ số lượng
      if (isCheckCount.length > 0) {
        return res.status(400).json({ message: isCheckCount });
      }

      //nếu tổng không đúng báo
      if (totalReCal != data.total) {
        return res.status(400).json({ message: "Total is wrong!" });
      }
      //valid tổng tiền ok

      //cập nhật tồn kho - số lượng đã check đủ
      data.products.forEach(async (el) => {
        const index = allProduct.findIndex((e) => e._id.equals(el.product));

        allProduct[index].count = allProduct[index].count - el.quantity;
        await allProduct[index].save();
      });

      //thêm mới đơn hàng
      const orderData = new Order(data);
      await orderData.save();

      //cập nhật số lượng vào

      //thêm ref vào user
      const userCurrent = await User.findById(req.body.user);
      if (userCurrent) {
        await userCurrent.updateOne({ $push: { orders: orderData._id } });
      }

      //báo email
      //do không lấy key sendGrid được nên dùng cách khác
      data.productSendMail = productSendMail;
      sendMail.sendMail("tiengphap2022@gmail.com", "Order successfully!", data);

      res.status(200).json({ message: "Successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  ///////////////////////////////8. (Client) Xem các đơn hàng đã đặt////////////
  //GET ALL ORDER - theo id-user
  getAllOrderUser: async (req, res) => {
    try {
      //lấy id user hiện tại - có được từ middleware authi

      //tìm tất cả order của {user: id} đó
      const allOrder = await Order.find({ user: req.body.user })
        .sort({ createdAt: -1 })
        .populate({
          path: "products.product",
        });

      res.status(200).json(allOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  ////////////////////////13. (Nâng cao) (Admin) Tạo Admin Dashboard/////////////
  //GET ALL ORDER - ADMIN
  //danh sách các đơn hàng gần đây nhất của hệ thống - SORT theo createAt
  getAllOrder: async (req, res) => {
    try {
      //tìm tất cả order - xếp theo ngày gần nhất
      const allOrder = await Order.find().sort({ createdAt: -1 }).populate({
        path: "products.product",
      });

      res.status(200).json(allOrder);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  /////các thông tin kinh doanh cơ bản: số lượng người dùng, số giao dịch, tổng doanh thu, doanh thu trung bình hàng tháng.
  getDashboardInfo: async (req, res) => {
    try {
      //tìm tất cả user
      const AllUser = await User.find();
      const totalUser = AllUser.length;

      //tất cả giao dịch
      const allOrder = await Order.find();
      const totalOrder = allOrder.length;

      //doanh thu trung bình tháng - lọc tất cả order trong tháng gần nhất - tính tổng doanh thu array filter đó
      const allOrderFilter = allOrder.filter((d) => {
        const targetDay = new Date(d.createdAt).getTime + 30 * 60 * 60 * 1000;
        const nowDay = new Date().getTime;

        return nowDay < targetDay;
      });
      let averageRevenue = 0;
      allOrderFilter.forEach((el) => {
        averageRevenue = averageRevenue + Number(el.total);
      });

      const dataResponse = {
        totalUser,
        totalOrder,
        averageRevenue,
      };
      res.status(200).json(dataResponse);
      // res.status(400).json({ message: "nono" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = orderController;
