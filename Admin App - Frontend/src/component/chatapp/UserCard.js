import styles from './UserCard.module.css'

const UserCard = (props) => {
  return <div className={styles.container}>
      <p className={styles.content}>
      <span> {props.children}</span>
      </p>
  </div>
}

export default UserCard;