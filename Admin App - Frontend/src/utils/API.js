const URL_Server = "http://localhost:5000";
// const URL_Server = "https://tmdt-asm3.onrender.com";

const ApiProduct = {
  apiAllProduct: `${URL_Server}/api/product/allproduct`,
  apiProduct: `${URL_Server}/api/product`, //AUTHI role ["ADMIN"]
};

const ApiUser = {
  apiUserRegister: `${URL_Server}/api/user/register`,
  apiUserLogin: `${URL_Server}/api/user/login`,
  apiAdminLogin: `${URL_Server}/api/user/login-admin`,
  apiGetAllUser: `${URL_Server}/api/user/alluser`, //AUTHI role ["ADMIN"]
};
const ApiOrder = {
  apiAddOrder: `${URL_Server}/api/order/add`, //AUTHI role ["ADMIN", "USER", "MOD"]
  apiAllOrder: `${URL_Server}/api/order/get`, //AUTHI role ["ADMIN", "USER", "MOD"]
  apiAllOrderAdmin: `${URL_Server}/api/order/allorder`, //AUTHI role ["ADMIN"]
  apiDashBoardInfo: `${URL_Server}/api/order/dashboard-info`, //AUTHI role ["ADMIN"]
};

const ApiMessage = {
  apiPostMessage: `${URL_Server}/api/message/add-message`, //AUTHI role ["ADMIN", "USER", "MOD"]
  apiGetAllMessage: `${URL_Server}/api/message/allmessage`, //AUTHI role ["ADMIN", "MOD"]
};
export { URL_Server, ApiProduct, ApiUser, ApiOrder, ApiMessage };
