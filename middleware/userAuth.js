const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

/////////////////9. (Admin) Phân quyền//////////////////////
//Ngoài jwt - còn check xem role có được phép truy cập route (api) đó hay không
//permission dưới dạng mảng các role được phép truy cập. Ví dụ: ['ADMIN', 'MOD']
const userAuth = (permission) => {
  return async (req, res, next) => {
    //lấy token từ header - 'Bearer hjakjsjkdahshasdkjdsahjk'
    if (!req.get("Authorization")) {
      return res.status(401).json("Please login!");
    }
    const token = req.get("Authorization").split(" ")[1];

    //dùng cấu trúc để decoded
    //jwt.verify(token, 'shhhhh', function(err, decoded) {})

    let decoded;
    jwt.verify(token, process.env.SECRET_KEY_JWT, function (err, decode) {
      //nếu có lỗi token thì return lỗi
      if (err) {
        return res.status(401).json(err.message);
      }
      decoded = decode;
    });

    //nếu decoded có thì thực hiện tiếp valid role
    if (decoded) {
      //tìm user theo jwt vừa gửi lên - để xác định có role hay không
      const userCurrent = await User.findById(decoded.user._id);
      if (!userCurrent) {
        return res.status(400).json("User Not Found!");
      }
      //nếu role không nằm trong list thì báo lỗi
      if (!permission.includes(userCurrent.role)) {
        return res.status(401).json("Not Permission!");
      }
      //
      req.body.user = userCurrent._id;
      next();
    }
  };
};

module.exports = userAuth;
