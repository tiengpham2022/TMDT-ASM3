import FormLogin from "../component/login/FormLogin";
import styles from "./LoginPage.module.css";

const LoginPage = () => {
  return (
    <div
      className={styles.containers}
      style={{
        backgroundImage: "url(img/banner1.jpg)",
      }}
    >
      <FormLogin />
    </div>
  );
};

export default LoginPage;
