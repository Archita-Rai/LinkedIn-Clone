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
                <div className={styles.userNameContainer}>
                  <p
                    className={styles.username}
                    style={{
                      fontWeight: "900",
                      color: "#D9069C",
                      fontSize: "1.1rem",
                    }}
                  >
                    Hey! {authState.user.userId.name}
                  </p>
                </div>
                <h4
                  className={styles.profile}
                  onClick={() => {
                    router.push("/profile");
                    dispatch(emptyMessage());
                  }}
                >
                  Profile
                </h4>

                
                  <button
                    className={styles.profile}
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("userId");
                      dispatch(reset());
                      router.push("/login");
                    }}
                  >
                    Logout
                  </button>
                
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
