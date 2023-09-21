const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");

const userController = {
  ///////////////////////3. (Client) Chức năng xác thực tài khoản////////////////////
  //register - POST - mã hoá password
  postUserRegister: async (req, res) => {
    try {
      //lấy data từ req
      //role nếu không có thì mặc định là USER (ADMIN - MOD)
      const dataRegister = {
        fullname: req.body.fullname ? req.body.fullname.trim() : "",
        email: req.body.email ? req.body.email.trim() : "",
        password: req.body.password ? req.body.password.trim() : "",
        phone: req.body.phone ? req.body.phone.trim() : "",
        role: req.body.role ? req.body.role.trim() : "USER",
      };

      //validation
      //1.các trường không được bỏ trống
      if (!dataRegister.fullname) {
        return res.status(400).json({ message: "Please enter your Fullname!" });
      } else if (!dataRegister.email) {
        return res.status(400).json({ message: "Please enter your Email!" });
      } else if (!dataRegister.email.includes("@")) {
        return res.status(400).json({ message: "Email not correct!" });
      } else if (!dataRegister.password) {
        return res.status(400).json({ message: "Please enter your Password!" });
      } else if (dataRegister.password.length < 8) {
        return res
          .status(400)
          .json({ message: "Password must be from 8 characters!" });
      } else if (!dataRegister.phone) {
        return res.status(400).json({ message: "Please enter your Phone!" });
      }

      //2.email có tồn tại chưa
      const userCurrent = await User.find({ email: dataRegister.email });

      if (userCurrent.length > 0) {
        return res.status(400).json({ message: "Email is exist!" });
      }

      //3.băm password bằng bcrypt - sau khi đã valid data thành công
      dataRegister.password = bcrypt.hashSync(req.body.password.trim(), 12);

      //4.thêm data vào database
      const createUser = new User(dataRegister);
      await createUser.save();

      res.status(200).json({ message: "Successfully!" });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //////////////////////3. (Client) Chức năng xác thực tài khoản/////////////////////
  //login - POST - cấp jwt_token
  postUserLogin: async (req, res) => {
    try {
      //lấy dataForm từ req
      const dataLogin = {
        email: req.body.email,
        password: req.body.password,
      };

      //validation
      //1.các trường không được bỏ trống
      if (!dataLogin.email) {
        return res.status(400).json({ message: "Please enter your email!" });
      } else if (!dataLogin.password) {
        return res.status(400).json({ message: "Please enter your password!" });
      }

      //2.tìm Email có tồn tại chưa
      const userCurrent = await User.find({ email: dataLogin.email });

      //nếu chưa có - nhập sai email
      if (!userCurrent.length) {
        return res.status(400).json({ message: "Email is not correct!" });
      }

      //nếu có thì kiểm tra pass - dùng compare.bcrypt
      const isValid = bcrypt.compareSync(
        dataLogin.password,
        userCurrent[0].password
      );
      //pass không đúng
      if (!isValid) {
        return res.status(400).json({ message: "Password is not correct!" });
      }

      /////////VALID DONE ///////////
      //lấy data user ngoại trừ password
      const { password, ...Others } = userCurrent[0]._doc;

      //tạo ACCESS_TOKEN cấp quyền user
      const USER_ACCESS_TOKEN = jwt.sign(
        { user: Others },
        process.env.SECRET_KEY_JWT,
        { expiresIn: 60 * 60 }
      );

      //data response gồm token và thông tin user ngoại trừ pass
      const returnData = {
        jwt_token: USER_ACCESS_TOKEN,
        user: Others,
      };

      res.status(200).json(returnData);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  //getAllUser
  getAllUser: async (req, res) => {
    try {
      const userList = await User.find().select("_id fullname phone role");

      res.status(200).json(userList);
    } catch (err) {
      console.log(err);
    }
  },

  /////////////////////////////9. (Admin) Phân quyền//////////////////////////
  //////////////////////////////13. (Nâng cao) (Admin) Tạo Admin Dashboard//////////////////
  // Ở phía admin, bạn sẽ chỉ tạo cơ chế Đăng nhập và Đăng xuất.
  // Đồng thời người dùng cũng cần phải có quyền "admin" hoặc quyền "tư vấn viên" thì mới có thể đăng nhập được vào hệ thống admin.

  //vì vậy tạo api riêng cho app admin - có check role khi login
  //Admin login - cấp jwt_token
  postAdminLogin: async (req, res) => {
    try {
      //lấy dataForm từ req
      const dataLogin = {
        email: req.body.email,
        password: req.body.password,
      };

      //validation
      //1.các trường không được bỏ trống
      if (!dataLogin.email) {
        return res.status(400).json({ message: "Please enter your email!" });
      } else if (!dataLogin.password) {
        return res.status(400).json({ message: "Please enter your password!" });
      }

      //2.tìm Email có tồn tại chưa
      const userCurrent = await User.find({ email: dataLogin.email });

      //nếu chưa có - nhập sai email
      if (!userCurrent.length) {
        return res.status(400).json({ message: "Email is not correct!" });
      }

      //nếu có thì kiểm tra pass - dùng compare.bcrypt
      const isValid = bcrypt.compareSync(
        dataLogin.password,
        userCurrent[0].password
      );
      //pass không đúng
      if (!isValid) {
        return res.status(400).json({ message: "Password is not correct!" });
      }

      //check xem role hiện tại có phải "admin" hoặc "mod" không
      if (userCurrent[0].role !== "ADMIN" && userCurrent[0].role !== "MOD") {
        return res.status(401).json({ message: "Account not permission!" });
      }

      /////////VALID DONE ///////////
      //lấy data user ngoại trừ password
      const { password, ...Others } = userCurrent[0]._doc;

      //tạo ACCESS_TOKEN cấp quyền user
      const USER_ACCESS_TOKEN = jwt.sign(
        { user: Others },
        process.env.SECRET_KEY_JWT,
        { expiresIn: 60 * 60 }
      );

      //data response gồm token và thông tin user ngoại trừ pass
      const returnData = {
        jwt_token: USER_ACCESS_TOKEN,
        user: Others,
      };

      res.status(200).json(returnData);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};

module.exports = userController;
