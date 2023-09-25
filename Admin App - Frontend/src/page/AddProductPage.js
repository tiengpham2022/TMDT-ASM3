import AddProductForm from "../component/products/AddProductForm";
import styles from "./AddProductPage.module.css";

const AddProductPage = () => {
  return (
    <div className={styles.containers}>
      <AddProductForm />
    </div>
  );
};

export default AddProductPage;
