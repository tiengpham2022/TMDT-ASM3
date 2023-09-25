import { useEffect, useState } from "react";
import Cookies from "js-cookie";

import { BsPersonPlus, BsFileEarmarkPlus } from "react-icons/bs";
import { MdOutlineAttachMoney } from "react-icons/md";

import styles from "./DashBoardPage.module.css";
import { ApiOrder } from "../utils/API";
import useHttp from "../hook-http/useHttp";
import { BallTriangle } from "react-loading-icons";
import { getToken } from "../utils/authi/isAuthi";

const DashBoardPage = () => {
  /////custom hook
  const { isLoading, isError, sendRequest } = useHttp();

  /////custom hook - get dashboard info
  const {
    isLoading: isLoadingInfo,
    isError: isErrorInfo,
    sendRequest: sendRequestInfo,
  } = useHttp();

  ///state
  const [orderList, setOrderList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalUser, setTotalUser] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const [averageRevenue, setAverageRevenue] = useState(0);

  //get api lấy order list
  useEffect(() => {
    const option = {
      url: ApiOrder.apiAllOrderAdmin,
      headers: {
        Authorization: "Bearer " + Cookies.get("jwt_token"),
      },
    };

    //get api
    sendRequest(option, setOrderList);
  }, []);

  //lấy info
  useEffect(() => {
    const option = {
      url: ApiOrder.apiDashBoardInfo,
      headers: {
        Authorization: "Bearer " + getToken(),
      },
    };

    // hàm đón data từ hook
    const messageHandle = (resData) => {
      //
      setTotalOrder(resData.totalOrder);
      setTotalUser(resData.totalUser);
      setAverageRevenue(resData.averageRevenue);
    };

    //gọi api
    sendRequestInfo(option, messageHandle);
  }, [sendRequestInfo]);

  return (
    <div className={styles.containers}>
      <div className={styles.container}>
        <div className={styles.row}>
          <div className={styles["col-items"]}>
            <div className={styles["col-item"]}>
              <div className={styles["item-content"]}>{totalUser}</div>
              <div className={styles["item-title"]}>Clients</div>
            </div>
            <div className={styles["col-item"]}>
              <BsPersonPlus color="#adb5bd" />
            </div>
          </div>
          <div className={styles["col-items"]}>
            <div className={styles["col-item"]}>
              <div className={styles["item-content"]}>
                {new Intl.NumberFormat("de-DE").format(averageRevenue)} VND
              </div>
              <div className={styles["item-title"]}>Earnings of Month</div>
            </div>
            <div className={styles["col-item"]}>
              <MdOutlineAttachMoney color="#adb5bd" />
            </div>
          </div>
          <div className={styles["col-items"]}>
            <div className={styles["col-item"]}>
              <div className={styles["item-content"]}>{totalOrder}</div>
              <div className={styles["item-title"]}>New Order</div>
            </div>
            <div className={styles["col-item"]}>
              <BsFileEarmarkPlus color="#adb5bd" />
            </div>
          </div>
        </div>
        {/* nếu get info lỗi */}
        {isErrorInfo && <div className={styles.loading}>{isErrorInfo}</div>}
        <div className={styles.content}>
          <div className={styles.header}>History</div>
          <div className="table-responsive">
            <table
              className={
                "table table-bordered table-striped " +
                styles["table-container"]
              }
            >
              <thead>
                <tr>
                  <th scope="col">ID User</th>
                  <th scope="col">Name</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Adress</th>
                  <th scope="col">Total</th>
                  <th scope="col">Delivery</th>
                  <th scope="col">Status</th>
                  <th scope="col">Detail</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td colspan="8">
                      <div className={styles.loading}>
                        <BallTriangle stroke="red" />
                      </div>
                    </td>
                  </tr>
                )}
                {isError && (
                  <tr>
                    <td colspan="8">
                      <div className={styles.loading}>{isError}</div>
                    </td>
                  </tr>
                )}
                {orderList.length > 0 &&
                  orderList.map((data) => {
                    return (
                      <tr>
                        <th
                        // scope="row"
                        >
                          {data._id}
                        </th>
                        <td>{data.fullname}</td>
                        <td>{data.phone}</td>
                        <td>{data.address}</td>
                        <td>
                          {new Intl.NumberFormat("de-DE").format(data.total)}{" "}
                          VND
                        </td>
                        <td>Chưa giao hàng</td>
                        <td>Chưa thanh toán</td>
                        <td>
                          <button className="btn btn-success">view</button>
                        </td>
                      </tr>
                    );
                  })}
                {/* <tr>
                  <th scope="row">3</th>
                  <td colspan="2">Larry the Bird</td>
                  <td>@twitter</td>
                </tr> */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardPage;
