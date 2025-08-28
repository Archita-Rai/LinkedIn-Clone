import React, { useEffect } from "react";
import styles from "./style.module.css";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  acceptConnection,
  getMyConnectionRequests,
} from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";
import { connection } from "next/server";

function MyConnectionPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    if (authState.connectionRequest !== 0) {
      console.log(authState.connectionRequest);
    }
  }, [authState.connectionRequest]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.myConnectionContainer}>
          <h4>My Connections Request</h4>

          {authState.connectionRequest.length === 0 && (
            <h1>No Connection Request</h1>
          )}

          {authState.connectionRequest.length != 0 &&
            authState.connectionRequest
              .filter((connection) => connection.status_accepted === null)
              .map((user) => {
                return (
                  <div
                    key={user._id}
                    className={styles.userRequestCard}
                    onClick={() => {
                      router.push(`/view_profile/${user.userId.username}`);
                    }}
                  >
                    <div className={styles.card}>
                      <div className={styles.profileImageConatianer}>
                        <img
                          src={`${BASE_URL}/${user.userId.profilePicture}`}
                          className={styles.userProfile}
                        ></img>
                      </div>
                      <div className={styles.userInfo}>
                        <h2>{user.userId.name}</h2>
                        <p>{user.userId.username}</p>
                      </div>

                      <button
                        className={styles.acceptButton}
                        onClick={ async(e) => {
                          e.stopPropagation();

                         await dispatch(
                            acceptConnection({
                              connectionId: user._id,
                              token: localStorage.getItem("token"),
                              action: "accept",
                            })

                          );

                          await dispatch(getMyConnectionRequests({ token: localStorage.getItem("token") }));
                        }}
                      >
                        Accept
                      </button>
                    </div>
                  </div>
                );
              })}
            


             <h4>My Network</h4>
          {authState.connectionRequest
            .filter((connection) => connection.status_accepted !== null)
            .map((user) => {
              return (
                <div
                  key={user._id}
                  className={styles.userRequestCard}
                  onClick={() => {
                    router.push(`/view_profile/${user.userId.username}`);
                  }}
                >
                  <div className={styles.card}>
                    <div className={styles.profileImageConatianer}>
                      <img
                        src={`${BASE_URL}/${user.userId.profilePicture}`}
                        className={styles.userProfile}
                      ></img>
                    </div>
                    <div className={styles.userInfo}>
                      <h2>{user.userId.name}</h2>
                      <p>{user.userId.username}</p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export default MyConnectionPage;
