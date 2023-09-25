import { IconAdmin } from "../../utils/Icon";

import styles from "./AdminCard.module.css";

const AdminCard = (props) => {
  return (
    <div className={styles.container}>
      <p className={styles.content}>
        <IconAdmin /> ADMIN:
        <span> {props.children}</span>
      </p>
    </div>
  );
};

export default AdminCard;
