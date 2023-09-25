import { useEffect, useRef, useState } from "react";
import { BallTriangle } from "react-loading-icons";

import styles from "./AddProductForm.module.css";
import { ApiProduct } from "../../utils/API";
import useHttpFormdata from "../../hook-http/useHttpFormdata";
import Toast from "../../utils/Toast";
import { useParams } from "react-router-dom";
import { getToken } from "../../utils/authi/isAuthi";
import useHttp from "../../hook-http/useHttp";

const AddProductForm = () => {
  const nameRef = useRef();
  const categoryRef = useRef();
  const priceRef = useRef();
  const countRef = useRef();
  const shortDescriptionRef = useRef();
  const longDescriptionRef = useRef();
  const imageRef = useRef();

  const [messageError, setMessageError] = useState("");
  const [nameIsValid, setNameIsValid] = useState(true);
  const [categoryIsValid, setCategoryIsValid] = useState(true);
  const [priceIsValid, setPriceIsValid] = useState(true);
  const [countIsValid, setCountIsValid] = useState(true);
  const [shortIsValid, setShortIsValid] = useState(true);
  const [longIsValid, setLongIsValid] = useState(true);
  const [imageIsValid, setImageIsValid] = useState(true);
  const [imageData, setImageData] = useState([]);

  //dùng url - params để phân chia giao diện post và edit sản phẩm
  const params = useParams();
  const idproduct = params.idproduct;

  ///////////////////////////////////////edit product///////////////////////////////
  const [mode, setMode] = useState("");
  //nếu là mode edit -- có 2 api, 1 là get data product cần edit ban đầu - 2 là send request update data
  const [editProductCurrent, setEditProductCurrent] = useState();
  const {
    isLoading: isloadingEdit,
    isError: isErrorEdit,
    sendRequest: sendRequestEdit,
  } = useHttp();
  // có 2 hook - 1 hook dùng gửi dạng json, 1 hook dạng formdata
  //edit và get không dùng tới formdata - chỉ cần dùng JSON là được
  const {
    isLoading: isloadingGet,
    isError: isErrorGet,
    sendRequest: sendRequestGet,
  } = useHttp();

  //nếu có param thì set state mode === edit
  //gọi api lấy data product cần edit
  useEffect(() => {
    if (idproduct) {
      setMode("edit");

      //gọi api tìm id product cần edit
      const option = {
        url: ApiProduct.apiProduct + "/" + idproduct,
        headers: {
          authorization: "Bearer " + getToken(),
        },
      };

      //gửi api
      sendRequestGet(option, setEditProductCurrent);
    }
  }, [idproduct]);

  //edit handle
  const editHandle = (e) => {
    //
    e.preventDefault();

    const data = {
      name: nameRef.current.value.trim(),
      category: categoryRef.current.value.trim(),
      price: priceRef.current.value,
      count: countRef.current.value,
      short_desc: shortDescriptionRef.current.value.trim(),
      long_desc: longDescriptionRef.current.value.trim(),
    };

    if (!data.name) {
      setNameIsValid(false);
      setMessageError("Please enter name product!");
      return;
    } else {
      setNameIsValid(true);
    }
    if (!data.category) {
      setCategoryIsValid(false);
      setMessageError("Please enter category!");
      return;
    } else {
      setCategoryIsValid(true);
    }
    if (!data.price) {
      setPriceIsValid(false);
      setMessageError("Please enter price!");
      return;
    } else {
      setPriceIsValid(true);
    }
    if (!data.count) {
      setCountIsValid(false);
      setMessageError("Please enter count!");
      return;
    } else {
      setCountIsValid(true);
    }
    if (!data.short_desc) {
      setShortIsValid(false);
      setMessageError("Please enter short description!");
      return;
    } else {
      setShortIsValid(true);
    }
    if (!data.long_desc) {
      setLongIsValid(false);
      setMessageError("Please enter long description!");
      return;
    } else {
      setLongIsValid(true);
    }

    /////////////////valid ok////////////////////
    //send api -
    const option = {
      url: ApiProduct.apiProduct + "/" + idproduct,
      method: "PUT",
      body: data,
      headers: {
        authorization: "Bearer " + getToken(),
        "Content-Type": "application/json",
      },
    };

    //hàm xử lý phản hồi
    const messagaHandle = (resData) => {
      //báo thành công
      Toast.message.success(resData.message, Toast.option);
      //xoá input

      nameRef.current.value = "";
      categoryRef.current.value = "";
      priceRef.current.value = "";
      countRef.current.value = "";
      shortDescriptionRef.current.value = "";
      longDescriptionRef.current.value = "";

      //edit xong chuyển trang về productlist
    };

    sendRequestEdit(option, messagaHandle);
  };

  ///////////////////////////////////add product///////////////////////////
  //custom hook add product
  const {
    isLoading: isLoadingPost,
    isError: isErrorPost,
    sendRequest: sendRequestPost,
  } = useHttpFormdata();

  const imageUpdateHandle = (e) => {
    setImageData(imageRef.current.files);
  };

  const submitHandle = (e) => {
    e.preventDefault();
    //validation data
    const data = {
      name: nameRef.current.value.trim(),
      category: categoryRef.current.value.trim(),
      price: priceRef.current.value,
      count: countRef.current.value,
      short_desc: shortDescriptionRef.current.value.trim(),
      long_desc: longDescriptionRef.current.value.trim(),
      files: imageRef.current.files,
    };

    if (!data.name) {
      setNameIsValid(false);
      setMessageError("Please enter name product!");
      return;
    } else {
      setNameIsValid(true);
    }
    if (!data.category) {
      setCategoryIsValid(false);
      setMessageError("Please enter category!");
      return;
    } else {
      setCategoryIsValid(true);
    }
    if (!data.price) {
      setPriceIsValid(false);
      setMessageError("Please enter price!");
      return;
    } else {
      setPriceIsValid(true);
    }
    if (!data.count) {
      setCountIsValid(false);
      setMessageError("Please enter count!");
      return;
    } else {
      setCountIsValid(true);
    }
    if (!data.short_desc) {
      setShortIsValid(false);
      setMessageError("Please enter short description!");
      return;
    } else {
      setShortIsValid(true);
    }
    if (!data.long_desc) {
      setLongIsValid(false);
      setMessageError("Please enter long description!");
      return;
    } else {
      setLongIsValid(true);
    }
    if (data.files.length < 1 || data.files.length > 4) {
      setImageIsValid(false);
      setMessageError("Please upload from 1 to 4 photos!");
      return;
    } else {
      setImageIsValid(true);
      setMessageError("");
    }
    console.log(data);
    //vì gửi api có image - nên setup khác - dùng multipar/form-data
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("category", data.category);
    formData.append("price", data.price);
    formData.append("count", data.count);
    formData.append("short_desc", data.short_desc);
    formData.append("long_desc", data.long_desc);
    for (let i = 0; i < data.files.length; i++) {
      formData.append("image", data.files[i]);
    }

    /////////////////valid ok////////////////////

    //send api
    const option = {
      url: ApiProduct.apiProduct,
      method: "POST",
      body: formData,
      headers: {
        authorization: "Bearer " + getToken(),
        // "Content-type": "multipart/form-data",
      },
    };

    //hàm xử lý phản hồi
    const messagaHandle = (resData) => {
      //báo thành công
      Toast.message.success(resData.message, Toast.option);
      //xoá input

      nameRef.current.value = "";
      categoryRef.current.value = "";
      priceRef.current.value = "";
      countRef.current.value = "";
      shortDescriptionRef.current.value = "";
      longDescriptionRef.current.value = "";
      imageRef.current.files = null;

      //thêm sản phẩm thì ở tại trang thêm sản phẩm
    };

    sendRequestPost(option, messagaHandle);
  };

  return (
    <form
      className={styles.containers}
      onSubmit={mode !== "edit" ? submitHandle : editHandle}
    >
      <div className={styles.container}>
        <div className={styles["message-error-center"]}>
          {isloadingGet && <BallTriangle stroke="red" />}
          {isErrorGet && <div>{isErrorGet}</div>}
        </div>
        <label htmlFor="name">Product Name</label>
        <input
          name="name"
          className={!nameIsValid ? styles["no-valid"] : ""}
          type="text"
          id="name"
          defaultValue={editProductCurrent ? editProductCurrent.name : ""}
          placeholder="Enter Product Name"
          ref={nameRef}
        ></input>
      </div>
      <div className={styles.container}>
        <label htmlFor="category">Category</label>
        <input
          className={!categoryIsValid ? styles["no-valid"] : ""}
          type="text"
          id="category"
          defaultValue={editProductCurrent ? editProductCurrent.category : ""}
          placeholder="Enter Category"
          ref={categoryRef}
        ></input>
      </div>
      <div className={styles.container}>
        <label htmlFor="price">Price</label>
        <input
          className={!priceIsValid ? styles["no-valid"] : ""}
          type="number"
          id="price"
          defaultValue={editProductCurrent ? editProductCurrent.price : ""}
          placeholder="Enter Price"
          min="1"
          ref={priceRef}
        ></input>
      </div>
      <div className={styles.container}>
        <label htmlFor="count">Count</label>
        <input
          className={!countIsValid ? styles["no-valid"] : ""}
          type="number"
          id="count"
          defaultValue={editProductCurrent ? editProductCurrent.count : ""}
          placeholder="Enter Count"
          min="0"
          step={1}
          ref={countRef}
        ></input>
      </div>
      <div className={styles.container}>
        <label htmlFor="shortdescription">Short Description</label>
        <textarea
          className={`${styles.shortdescription} ${
            !shortIsValid ? styles["no-valid"] : ""
          }`}
          type="text"
          defaultValue={editProductCurrent ? editProductCurrent.short_desc : ""}
          id="shortdescription"
          placeholder="Enter Short Description"
          ref={shortDescriptionRef}
        ></textarea>
      </div>
      <div className={styles.container}>
        <label htmlFor="longdescription">Long Description</label>
        <textarea
          className={`${styles.longdescription} ${
            !longIsValid ? styles["no-valid"] : ""
          }`}
          type="text"
          id="longdescription"
          defaultValue={editProductCurrent ? editProductCurrent.long_desc : ""}
          placeholder="Enter Long Description"
          ref={longDescriptionRef}
        ></textarea>
      </div>
      {/* không sửa ảnh - nên ẩn ở mode edit*/}

      <div className={styles.container}>
        <div>Upload image (4 images)</div>
        <input
          className={styles.file}
          type="file"
          id="image"
          placeholder="Enter Long Description"
          multiple
          accept="image/png, image/jpeg"
          ref={imageRef}
          onChange={imageUpdateHandle}
          disabled={mode === "edit"}
        ></input>
      </div>

      {/* hiện các file đã add */}
      {/* {imageData && imageData.length > 1 ? <p>{imageData.name}</p> : ""} */}
      {messageError && (
        <div className={styles["message-error"]}>{messageError}</div>
      )}
      {!messageError && isErrorPost && (
        <div className={styles["message-error"]}>{isErrorPost}</div>
      )}
      {!messageError && isErrorEdit && (
        <div className={styles["message-error"]}>{isErrorEdit}</div>
      )}
      {!messageError && isErrorGet && (
        <div className={styles["message-error"]}>{isErrorGet}</div>
      )}
      {mode === "edit" ? (
        <div>
          <button type="submit" className="btn btn-primary">
            {isloadingEdit ? "Sending..." : isloadingGet ? "Loading" : "Update"}
          </button>
        </div>
      ) : (
        <div>
          <button type="submit" className="btn btn-primary">
            {isLoadingPost ? "Sending..." : "Submit"}
          </button>
        </div>
      )}

      {Toast.container}
    </form>
  );
};
export default AddProductForm;
