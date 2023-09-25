import { BallTriangle } from "react-loading-icons";
import styles from "./ProductList.module.css";

const ProductList = (props) => {
  const deleteProductHandle = (id) => {
    props.onDeleteProduct(id);
  };

  const navigateUpdateHandle = (id) => {
    props.onUpdateProduct(id);
  };
  return (
    <div className={"table-responsive " + styles.containers}>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">NAME</th>
            <th scope="col">PRICE</th>
            <th scope="col">IMAGE</th>
            <th scope="col">QUANTITY</th>
            <th scope="col">CATEGORY</th>
            <th scope="col">EDIT</th>
          </tr>
        </thead>

        <tbody className={styles.row}>
          {props.isLoading && (
            <tr>
              <td colspan="6">
                <div className={styles.loading}>
                  <BallTriangle stroke="red" />
                </div>
              </td>
            </tr>
          )}
          {props.isError && (
            <tr>
              <td colspan="6">
                <div className={styles.loading}>{props.isError}</div>
              </td>
            </tr>
          )}

          {!props.isLoading &&
            props.items.map((data) => {
              return (
                <tr key={data._id}>
                  <td>{data._id}</td>
                  <td>{data.name}</td>
                  <td>
                    {new Intl.NumberFormat("de-DE").format(data.price)} VND
                  </td>

                  <td>
                    <img
                      className={styles.image}
                      src={data.img1}
                      alt={data.name}
                    ></img>
                  </td>
                  <td>{data.count}</td>
                  <td>{data.category}</td>
                  <td>
                    <div className={styles["btn-container"]}>
                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={() => navigateUpdateHandle(data._id)}
                      >
                        UPDATE
                      </button>
                      <button
                        onClick={() => deleteProductHandle(data._id)}
                        type="button"
                        className="btn btn-danger"
                      >
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
      {props.items.length === 0 && !props.isLoading && (
        <div className={styles.loading}>No data</div>
      )}
    </div>
  );
};

export default ProductList;
