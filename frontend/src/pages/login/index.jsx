import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./style.module.css";
import { loginUser, registerUser } from "@/config/redux/action/authAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";

function LoginComponent() {
  const [userLoginMethod, setUserLoginMethod] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);
  
  useEffect(()=>{
    if(localStorage.getItem("token") !== null && localStorage.getItem("userId") !== null){
      router.push("/dashboard");
    }
  },[])
  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod]);

  const handleRegister = () => {
    dispatch(registerUser({ name, email, password, username }));
    setName("");
    setEmail("");
    setPassword("");
    setUsername("");

  };

  const handleLogin = () => {
    dispatch(loginUser({ email, password }));
    setEmail("");
    setPassword("");
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer_left}>
            <h2 style={{ color: "#3b82f6" , fontFamily:"popins", fontWeight:"900"}}>
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </h2>
            <p
              className={styles.errorMsg}
              style={{ color: authState.isError ? "red" : "green" }}
            >
              {" "}
              {authState.message.message}
            </p>
            <div className={styles.inputContainer}>
              {!userLoginMethod && (
                <div className={styles.inputContainer_name_username}>
                  <input
                    className={styles.inputRow}
                    placeholder="Enter name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  ></input>
                  <input
                    className={styles.inputRow}
                    placeholder="Enter username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  ></input>
                </div>
              )}
              <input
                className={styles.inputField}
                placeholder="Enter email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              ></input>
              <br></br>
              <input
                className={styles.inputField}
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              ></input>
              <br></br>
            </div>
            <button
              className={styles.sign_in_up_btn}
              onClick={(e) => {
                if (userLoginMethod) {
                  handleLogin();
                } else {
                  handleRegister();
                }
              }}
            >
              {userLoginMethod ? "Sign In" : "Sign Up"}
            </button>
            <div
              style={{ display: "inline-block", paddingInline: "0.5rem" }}
              onClick={(e) => {
                setUserLoginMethod(!userLoginMethod);
              }}
            >
              <p className={styles.loginOptions}>
                {!userLoginMethod
                  ? "You already have an account ? Sign In"
                  : "You don't have an account ? Sign Up"}
              </p>
            </div>
          </div>
          <div className={styles.cardContainer_right}>
            <div className={styles.login}>
              <h2 className={styles.loginTitle}>
                {!userLoginMethod
                  ? "Already Have an Account"
                  : "Don't Have an Account"}
              </h2>
              <button
                style={{ background: "white", color: "#6366f1", fontFamily:"popins",fontWeight:"bold" }}
                className={styles.sign_in_up_btn}
                onClick={(e) => {
                  setUserLoginMethod(!userLoginMethod);
                }}
              >
                {!userLoginMethod ? "Sign In" : "Sign Up"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

export default LoginComponent;
