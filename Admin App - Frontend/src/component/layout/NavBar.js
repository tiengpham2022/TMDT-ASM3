import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginActions } from "../../store";
import { useSelector } from "react-redux";

import styles from "./NavBar.module.css";

const NavBar = () => {
  //class active và không active
  const classActive = styles.item + " " + styles.active;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const role = useSelector((state) => state.login.user.role);

  const productsNavigateHandle = () => {
    navigate("/products");
  };
  const dashboardNavigateHandle = () => {
    navigate("/dashboard");
  };
  const chatappNavigateHandle = () => {
    navigate("/chatapp");
  };

  //logout
  const logoutHandle = () => {
    const isConfirm = window.confirm("Confirm!");

    if (isConfirm) {
      dispatch(loginActions.ON_LOGOUT());
      navigate("/login");
    }
  };
  return (
    <div className={styles.containes}>
      <div className={styles["title-page"]}>Admin Page</div>
      <div>
        <div className={styles.container}>
          <div className={styles.subtitle}>MAIN</div>
          <div className={styles.items}>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive ? classActive : styles.item
              }
            >
              DashBoard
            </NavLink>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.subtitle}>LISTS</div>
          <div className={styles.items}>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? classActive : styles.item
              }
            >
              Products
            </NavLink>
            <NavLink
              to="/chatapp"
              className={({ isActive }) =>
                isActive ? classActive : styles.item
              }
            >
              Chat
            </NavLink>
          </div>
        </div>
        <div className={styles.container}>
          <div className={styles.subtitle}>USER</div>
          <div className={styles.items}>
            <div onClick={logoutHandle} className={styles.item}>
              Logout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
