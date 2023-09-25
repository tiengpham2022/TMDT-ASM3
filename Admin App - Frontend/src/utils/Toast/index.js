import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//popup hiện thông báo
const option = {
  position: "bottom-left",
  autoClose: 1000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "light",
};

const Toast = {
  container: <ToastContainer />,
  message: toast,
  option,
};

export default Toast;
