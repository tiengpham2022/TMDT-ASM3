import { useState, useEffect } from "react";

import ProductList from "../component/products/ProductList";

import { ApiProduct } from "../utils/API";
import styles from "./ProductsPage.module.css";
import { useNavigate } from "react-router-dom";
import useHttp from "../hook-http/useHttp";
import { getToken } from "../utils/authi/isAuthi";
import Toast from "../utils/Toast";

const ProductsPage = () => {
  //dùng custom hook
  const {
    isLoading: isLoadingGet,
    isError: isErrorGet,
    sendRequest: sendRequestGet,
  } = useHttp();
  const {
    isLoading: isLoadingDelete,
    isError: isErrorDelete,
    sendRequest: sendRequestDelete,
  } = useHttp();

  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [searchEntered, setSearchEntered] = useState("");

  //chuyển trang addproduct
  const addProductHandle = () => {
    navigate("/addproduct");
  };

  //gọi api lấy all product
  useEffect(() => {
    const option = {
      url: ApiProduct.apiAllProduct,
    };

    //hàm cb lấy data từ hook
    const messageHandle = (resData) => {
      setProductData(resData);
      setSearchList(resData);
    };
    //gọi api
    sendRequestGet(option, messageHandle);
  }, [sendRequestGet]);

  ///////////////////lọc sản phẩm///////////
  //khi input thay đổi thì lọc lại theo input
  useEffect(() => {
    let productDataFilter;
    if (!searchEntered.trim()) {
      productDataFilter = [...productData];
    }
    if (searchEntered.trim()) {
      productDataFilter = productData.filter((data) =>
        data.name.toLowerCase().includes(searchEntered)
      );
    }
    setSearchList(productDataFilter);
  }, [searchEntered]);

  //khi input thay đổi = setstate input
  const searchChangeHandle = (e) => {
    setSearchEntered(e.target.value.trim().toLowerCase());
    console.log(e.target.value.trim().toLowerCase());
  };

  //update sản phẩm - chuyển trang sang trang addproduct (dùng chung form)
  const updateProductHandle = (id) => {
    navigate("/addproduct/" + id);
  };

  //xóa sản phẩm - cần token - role là "ADMIN"
  const deleteProductHandle = (id) => {
    //cấu hình api gửi đi
    const option = {
      url: ApiProduct.apiProduct + "/" + id,
      method: "DELETE",
      headers: {
        authorization: "Bearer " + getToken(),
      },
    };

    //hàm đón response
    const messageHandle = (resData) => {
      ///báo thành công
      Toast.message.success(resData.message, Toast.option);

      //thành công thì xoá data trong state productdata list
      const array = [...productData];
      const index = array.findIndex((d) => id === d._id);
      if (index !== -1) {
        array.splice(index, 1);
        setProductData(array);
        setSearchList(array);
      }
    };

    //confirm delete
    const isConfirm = window.confirm("Confirm Delete!");
    if (isConfirm) {
      sendRequestDelete(option, messageHandle);
    }
  };

  return (
    <div className={styles.containers}>
      <div className={styles["title-row"]}>
        <div>Products</div>
        <button
          type="button"
          className="btn btn-info"
          onClick={addProductHandle}
        >
          Add New
        </button>
      </div>
      <div className={styles["search-row"]}>
        <input
          className={styles["input-search"]}
          placeholder="Enter Search!"
          onChange={searchChangeHandle}
        ></input>
      </div>
      {isErrorDelete && (
        <div className={styles["message-error"]}>{isErrorDelete}</div>
      )}
      <ProductList
        isLoading={isLoadingGet}
        isError={isErrorGet}
        onDeleteProduct={deleteProductHandle}
        onUpdateProduct={updateProductHandle}
        items={searchList}
      />
      {Toast.container}
    </div>
  );
};

export default ProductsPage;
