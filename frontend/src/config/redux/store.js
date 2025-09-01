import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});




















                // <div style={{ flex: "0.2" }}>
                //   <h3> Recent Activity</h3>

                //   {userPosts.map((post) => {
                //     return (
                //       <div key={post._id} className={styles.postCard}>
                //         <div className={styles.card}>
                //           <div className={styles.card_profileContainer}>
                //             {post.media !== "" ? (
                //               <img
                //                 src={`${BASE_URL}/${post.media}`}
                //                 alt="User recent post"
                //               />
                //             ) : (
                //               ""
                //             )}
                //           </div>
                //           <p>{post.body}</p>
                //         </div>
                //       </div>
                //     );
                //   })}
                // </div>