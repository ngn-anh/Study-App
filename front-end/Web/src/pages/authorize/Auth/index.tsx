import styles from "./index.module.css";
import illustration from '../../../assets/auth/illustration.png'
import logo from '../../../assets/auth/logo.png'
import AuthForm from "../../../component/AuthForm";

export default function Auth(props: {setUserData: any}) {
  return (
    <div className={styles.container}>
      <div className={styles.left}> 
        <div className={styles.leftContent}>
          <p className={styles.welcome}>Chào mừng bạn đến với</p>
          <img src={logo} className={styles.logo} />
          <p className={styles.systemLabel}>Hệ thống đăng nhập tập trung EDUFIT</p>
        </div>
        <div className={styles.illustrationWrapper}>
          <img src={illustration} className={styles.illustration} />
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.rightContent}>
          <AuthForm setUserData= {props.setUserData} />
        </div>
      </div>
    </div>
  );
}
