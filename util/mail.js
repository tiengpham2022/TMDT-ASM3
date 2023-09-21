const message = (data) => {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-4bw+/aepP/YC94hEpVNVgiZdgIC5+VKNBQNGCHeKRQN+PtmoHDEXuppvnDJzQIu9"
        crossorigin="anonymous"
      />
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-HwwvtgBNo3bZJJLYd8oVXjrBZt8cqVSpeBNS5n7C8IVInixGAoxmnlMuBnhbgrkm" crossorigin="anonymous"></script>

      <title>Mail Message</title>

      <style>
      .img {
        width: 60px;
      }
      .name {
        width: 200px
      }
    </style>
    </head>
    <body>
      <div>
        <h2>Xin chào ${data.fullname}</h2>
        <p>Phone: ${data.phone}</p>
        <p>Address: ${data.address}</p>
        <table class="table table-bordered border-white">
          <thead>
            <tr>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Giá</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${data.productSendMail.map((d) => {
              return `<tr><th class="name">${d.product.name}</th>
              <th><img src=${d.product.img1} alt=${
                d.product.name
              } class="img" /></th>
              <td>${d.product.price}</td>
              <td>${d.quantity} VND</td>
              <td>${d.quantity * d.product.price} VND</td></tr>
              `;
            })}
          </tbody>
        </table>
  
        <h3>Tổng thanh toán:</h3>
        <h3>${data.total}VND</h3>
        <div>Cảm ơn bạn!</div>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.8/dist/umd/popper.min.js" integrity="sha384-I7E8VVD/ismYTF4hNIPjVp/Zjvgyol6VFvRkX/vR+Vc4jQkC+hVqc2pM8ODewa9r" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.1/dist/js/bootstrap.min.js" integrity="sha384-Rx+T1VzGupg4BHQYs2gCW9It+akI2MM/mndMCy36UVfodzcJcF0GGLxZIzObiEfa" crossorigin="anonymous"></script>
    </body>

  </html>
  `;
};

const nodeMailer = require("nodemailer");

// email send message
const adminEmail = "khanhpqfx21417@funix.edu.vn";
// mk ứng dụng app
const adminPassword = process.env.adminPassword;

const mailHost = "smtp.gmail.com";
const mailPort = 465;

const sendMail = (to, subject, htmlContent) => {
  // Khởi tạo transporter object sử dụng chuẩn giao thức truyền tải SMTP với các thông tin cấu hình ở trên.
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: true, // nếu dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
  });

  const options = {
    from: adminEmail, // địa chỉ admin email bạn dùng để gửi
    to: to, // địa chỉ gửi đến
    subject: subject, // Tiêu đề của mail
    html: message(htmlContent), // Phần nội dung mail mình sẽ dùng html thay vì thuần văn bản thông thường.
  };

  // hàm transporter.sendMail() này sẽ trả về cho chúng ta một Promise
  return transporter.sendMail(options);
};

module.exports = {
  sendMail: sendMail,
};
