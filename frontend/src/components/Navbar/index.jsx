import React from "react";
import styles from "./styles.module.css";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { emptyMessage, reset } from "@/config/redux/reducer/authReducer";

function NavbarComponent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  return (
    <div className={styles.container}>
      <nav className={styles.navbar}>
        <h1
          className={styles.homeLink}
          style={{ cursor: "pointer" }}
          onClick={() => {
            router.push("/");
          }}
        >
          Pro connect
        </h1>
        <div className={styles.navbarOptions}>
          {authState.profileFetch && (
            <div>
              <div className={styles.profileOptions}>
                <p className={styles.username}>
                  Hey! {authState.user.userId.name}
                </p>
                <h4 className={styles.profile}  onClick={()=>{
                  router.push("/profile")
                  dispatch(emptyMessage())
                }}>Profile</h4>
                <h4
                  className={styles.profile}
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    dispatch(reset());
                    router.push("/login");
                  }}
                >
                  Log out
                </h4>
              </div>
            </div>
          )}

          {!authState.profileFetch && (
            <button
              className={styles.joinButton}
              onClick={() => router.push("/login")}
            >
              Be a part
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default NavbarComponent;
