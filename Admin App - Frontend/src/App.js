import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./App.css";
import DashBoardPage from "./page/DashBoardPage";
import LayoutRoot from "./page/LayoutRoot";
import ProductsPage from "./page/ProductsPage";
import AddProductPage from "./page/AddProductPage";
import ChatAppPage from "./page/ChatAppPage";
import LoginPage from "./page/LoginPage";
import NotPermission from "./page/NotPermission";
import Page404 from "./page/Page404";
import { isAdminLoader, isLoginLoader } from "./utils/authi/isAuthi";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LayoutRoot />,
      // loader check xem có đăng nhập chưa - hoặc token còn hạn không - nếu không chuyển sang login
      loader: isLoginLoader,
      children: [
        { index: true, element: <DashBoardPage />, loader: isAdminLoader },
        {
          path: "dashboard",
          element: <DashBoardPage />,
          loader: isAdminLoader,
        },
        { path: "products", element: <ProductsPage />, loader: isAdminLoader },
        {
          path: "addproduct",
          element: <AddProductPage />,
          loader: isAdminLoader,
        },
        {
          path: "addproduct/:idproduct",
          element: <AddProductPage />,
          loader: isAdminLoader,
        },
        { path: "chatapp", element: <ChatAppPage /> },
        { path: "notpermission", element: <NotPermission /> },
      ],
    },
    { path: "login", element: <LoginPage /> },
    { path: "*", element: <Page404 /> },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
