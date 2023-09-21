const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

///////////////////////cấu hình lưu trữ/////////////

//lưu vào server khi valid ok
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // cb(null, file.fieldname + "-" + uniqueSuffix);
    cb(null, uuidv4() + "_" + file.originalname);
  },
});

////tạo middleware upload////
// muốn lưu ảnh thì .single || .array || .fields
const upload = multer({ storage: diskStorage });

module.exports = { upload };
