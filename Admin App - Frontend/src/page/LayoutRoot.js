import { Outlet } from "react-router-dom";

import NavBar from "../component/layout/NavBar";

import styles from "./LayoutRoot.module.css";

const LayoutRoot = () => {
  return (
    <div>
      <NavBar />
      <div className={styles.container}>
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutRoot;
