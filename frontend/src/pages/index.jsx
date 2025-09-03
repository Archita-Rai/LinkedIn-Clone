import Head from "next/head";
// import Image from "next/image";
// import { } from "next/font/google";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

export default function Home() {
  const router = useRouter();
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.main_container}>
          <div className={styles.mainContainer_left}>
            <p className={styles.connectPara}>
              Connect with Friends without  Exaggeration
            </p>
            <p className={styles.socialMediaPara}>
              A True social media platform,with stories no blufs !
            </p>
            <div className={styles.loginOption}>
              <button
                className={styles.joinButton}
                onClick={() => router.push("/login")}
              >
                Join Now{" "}
              </button>
            </div>
          </div>
          <div className={styles.mainConatiner_right}>
            <img
              src="images/mainHome-connection-img.png"
              alt=""
              className={styles.home_main_connection_img}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
