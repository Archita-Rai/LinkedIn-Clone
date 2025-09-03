import React, { useEffect } from "react";
import styles from "./style.module.css";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "@/config/redux/action/authAction";
import { BASE_URL } from "@/config";
import { useRouter } from "next/router";

export default function DiscoverPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);

  useEffect(() => {
    if (!authState.allProfileFetched) {
      dispatch(getAllUsers());
    }
  },[]);
  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <h1 style={{marginLeft:"6rem"}} className={styles.discover_heading}> Discover</h1>
          <div className={styles.allUserProfile}>
            {
              authState.allProfileFetched && authState.allUsers.map((user)=>{
                return(
                  <div key = {user._id} className={styles.userProfileCard} onClick={()=>{
                     router.push(`/view_profile/${user.userId.username}`)
                  }}>
                    
                    <img src={`${BASE_URL}/${user.userId.profilePicture}`} alt="Profile_Pic" className={styles.userCardImage }></img><div className={styles.userProfileInfo}>
                    <h2 className={styles.userName_discover}>{user.userId.name}</h2>
                    <p>{user.userId.email}</p></div>
                  </div>
                )
              })
            }
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
