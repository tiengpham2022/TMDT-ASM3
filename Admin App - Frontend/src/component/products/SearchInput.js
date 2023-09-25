import styles from "./SearchInput.module.css";

const SearchInput = () => {
  return (
    <div>
      <div>Products</div>
      <div>
        <input
          className={styles["input-search"]}
          placeholder="Enter Search!"
        ></input>
      </div>
      <div>
        <input
          className={styles["input-search"]}
          placeholder="Enter Search!"
        ></input>
      </div>
    </div>
  );
};

export default SearchInput;
