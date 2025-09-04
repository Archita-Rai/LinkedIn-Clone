import React, { useEffect, useRef, useState } from "react";
import styles from "./style.module.css";
import UserLayout from "@/layout/UserLayout";
import DashboardLayout from "@/layout/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteEducation,
  deleteWork,
  getAboutUser,
  getAllUsers,
  updateUser,
  updateUserProfile,
} from "@/config/redux/action/authAction";
import { BASE_URL, clientServer } from "@/config";
import {
  deleteComment,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementPostLikes,
  postComment,
} from "@/config/redux/action/postAction";
import { emptyMessage } from "@/config/redux/reducer/authReducer";
import { resetPostId } from "@/config/redux/reducer/postReducer";


function ProfilePage() {
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);

  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const [commentTex, setCommentText] = useState("");
  const [isComment, setIsComment] = useState(false);
  const [isCommentDelete, setIsCommentDelete] = useState(false);
  const [isWorkModelOpen, setIsWorkModelOpen] = useState(false);
  const [isEducationModelOpen, setIsEducationModelOpen] = useState(false);

  const [isWorkEditable, setIsWorkEditable] = useState(false);
  const [isEucationEditable, setIsEducationEditable] = useState(false);

  const [inputData, setInputData] = useState({
    company: "",
    position: "",
    years: "",
  });

  const [educationInputData, setEducationInputData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
  });

  const isAnyWorkFieldEmpty = Object.values(inputData).some(
    (value) => value.trim() === ""
  );
  const isAnyEducationFieldEmpty = Object.values(educationInputData).some(
    (value) => value.trim() === ""
  );

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
  };

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setEducationInputData({ ...educationInputData, [name]: value });
  };

  useEffect(() => {
    dispatch(
      getAboutUser({
        token: localStorage.getItem("token"),
      })
    );
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user && authState.user.userId) {
      setUserProfile(authState.user);
      console.log(authState.user.userId.username);

      let post = postState.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });

      setUserPosts(post);
    }
  }, [authState.user, postState.posts]);

  const updateProfilePicture = async (file) => {
    const fromData = new FormData();

    fromData.append("profile_picture", file);
    fromData.append("token", localStorage.getItem("token"));

    const id = localStorage.getItem("userId");

    const response = await clientServer.post(
      `users/${id}/profile_picture`,
      fromData,
      {
        headers: {
          "Content-Types": "multipart/form-data",
        },
      }
    );

    dispatch(
      getAboutUser({
        token: localStorage.getItem("token"),
      })
    );
    dispatch(getAllUsers());
    dispatch(getAllPosts());
  };

  const handleDeleteEducation = (index, education) => {
    // Step 1: Remove from UI immediately
    const updatedEducation = [...userProfile.education];
    updatedEducation.splice(index, 1);
    setUserProfile({ ...userProfile, education: updatedEducation });

    //step:2  If it exists in DB, call delete API
    if (education._id) {
      dispatch(deleteEducation(education._id));
    }
  };

  const handleDeleteWork = (index, work) => {
    // Step 1: Remove from UI immediately
    const updatedWork = [...userProfile.pastWork];
    updatedWork.splice(index, 1);
    setUserProfile({ ...userProfile, pastWork: updatedWork });

    //step:2  If it exists in DB, call delete API
    if (work._id) {
      dispatch(deleteWork(work._id));
    }
  };

  return (
    <UserLayout>
      <DashboardLayout>
        {authState.user && userProfile.userId && (
          <div className={styles.container}>
            <div className={styles.backDropContainer}>
              <label
                className={styles.backDrop_overLay}
                htmlFor="profilePicture_edit"
              >
                <p>Edit</p>
              </label>
              <input
                type="file"
                id="profilePicture_edit"
                hidden
                onChange={(e) => {
                  updateProfilePicture(e.target.files[0]);
                }}
              />

              <img
                className={styles.backDrop}
                src={`${BASE_URL}/${userProfile.userId.profilePicture}`}
              ></img>
            </div>

            <div className={styles.profileContainer_details}>
              <div style={{ display: "flex", gap: "0.7rem" }}>
                <div className={styles.viewProfile_userInfo}>
                  <div className={styles.userInfo_wrapper}>
                    <input
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.name}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        });
                      }}
                    />
                    <input
                      style={{
                        color: "gray",
                        fontWeight: "300",
                        fontSize: "1rem",
                      }}
                      className={styles.nameEdit}
                      type="text"
                      value={userProfile.userId.username}
                      onChange={(e) => {
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            username: e.target.value,
                          },
                        });
                      }}
                    />
                    {authState.message && (
                      <p className={styles.errorMsg}>{authState.message} </p>
                    )}
                  </div>

                  <div>
                    <textarea
                      placeholder="add your bio"
                      value={userProfile.bio}
                      spellCheck={isFocused} // only true while focused
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) =>
                        setUserProfile({ ...userProfile, bio: e.target.value })
                      }
                      rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                    ></textarea>
                  </div>

                  <div className={styles.workHistory}>
                    <div className={styles.currentPost_wrapper}>
                      <label htmlFor="currentPost">Current Post:</label>
                      <input
                        placeholder="Add your current post"
                        style={{backgroundColor:"white"}}
                        id="currentPost"
                        className={styles.nameEdit}
                        type="text"
                        value={userProfile.currentPost}
                        onChange={(e) => {
                          setUserProfile({
                            ...userProfile,
                            currentPost: e.target.value,
                          });
                        }}
                      />
                    </div>

                    <div>
                      <h3>Work History</h3>
                      <div className={styles.workHistoryContainer}>
                        {userProfile.pastWork.map((work, index) => {
                          return (
                            <div
                              key={work._id}
                              className={styles.workHistoryCard}
                            >
                              {isWorkEditable && (
                                <div
                                  className={styles.crossIcon}
                                  onClick={() => {
                                    handleDeleteWork(index, work);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18 18 6M6 6l12 12"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.8rem",
                                  }}
                                >
                                  {work.company} - {work.position}
                                </p>
                                <p>{work.years} year</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        className={styles.addWork}
                        onClick={() => {
                          setIsWorkEditable(true);
                          setTimeout(() => {
                            setIsWorkEditable(false);
                          }, 10000);
                          setIsWorkModelOpen(true);
                        }}
                      >
                        Add Work
                      </button>
                    </div>

                    <div>
                      <h3>Education</h3>
                      <div className={styles.workHistoryContainer}>
                        {userProfile.education.map((educ, index) => {
                          return (
                            <div
                              key={educ._id}
                              className={styles.workHistoryCard}
                            >
                              {isEucationEditable && (
                                <div
                                  className={styles.crossIcon}
                                  onClick={() => {
                                    handleDeleteEducation(index, educ);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M6 18 18 6M6 6l12 12"
                                    />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <p
                                  style={{
                                    fontWeight: "bold",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "0.8rem",
                                  }}
                                >
                                  {educ.school} - {educ.degree}
                                </p>
                                <p>{educ.fieldOfStudy} year</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <button
                        className={styles.addWork}
                        onClick={() => {
                          setIsEducationEditable(true);
                          setTimeout(() => {
                            setIsEducationEditable(false);
                          }, 10000);

                          setIsEducationModelOpen(true);
                        }}
                      >
                        Add Education
                      </button>
                    </div>
                  </div>

                  {userProfile != authState.user && (
                    <div
                      className={styles.updateProfileBtn}
                      onClick={() => {
                        dispatch(updateUser(userProfile));
                        dispatch(updateUserProfile(userProfile));
                        dispatch(emptyMessage());
                        setIsEducationEditable(false);
                        setIsWorkEditable(false);
                      }}
                    >
                      update Profile
                    </div>
                  )}
                </div>
              </div>
              <hr style={{ marginTop: "0.5rem" }}></hr>
              {userPosts.length > 0 && (
                <div className={styles.postContainer}>
                  <h2>Your All Posts</h2>
                  {userPosts.map((post) => {
                    return (
                      <div key={post._id} className={styles.postCardContainer}>
                        <div
                          className={styles.postCardContainer_profileConatiner}
                        >
                          <img
                            className={styles.userProfilePic}
                            src={`${BASE_URL}/${post.userId.profilePicture}`}
                          />
                          <div className={styles.postCardInfo}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                              }}
                            >
                              <p style={{ fontWeight: "bold" }}>
                                {post.userId.name}
                              </p>
                              {post.userId._id == authState.user.userId._id && (
                                <div
                                  style={{ cursor: "pointer" }}
                                  onClick={async () => {
                                    await dispatch(deletePost(post._id));
                                    await dispatch(getAllPosts());
                                  }}
                                >
                                  <svg
                                    style={{ height: "20px", color: "red" }}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p style={{ color: "gray" }}>
                              {post.userId.username}
                            </p>
                            <p
                              style={{
                                paddingTop: "1.3rem",
                                fontSize: "1.1rem",
                                fontWeight: "400",
                              }}
                            >
                              {" "}
                              {post.body}{" "}
                            </p>
                            {/* post images */}
                            {post.media && (
                              <div className={styles.postCardImage}>
                                <img src={`${BASE_URL}/${post.media}`} />
                              </div>
                            )}
                            <div className={styles.optionsContainer}>
                              <div
                                className={styles.singleOption}
                                onClick={async () => {
                                  await dispatch(incrementPostLikes(post._id));
                                  await dispatch(getAllPosts());
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill={
                                    post.likedBy.includes(
                                      authState.user.userId._id
                                    )
                                      ? "#F33780"
                                      : "none"
                                  }
                                  stroke={
                                    post.likedBy.includes(
                                      authState.user.userId._id
                                    )
                                      ? "#F33780"
                                      : "currentColor"
                                  }
                                  strokeWidth={1.5}
                                  className="size-6"
                                >
                                  <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                </svg>

                                <p>{post.likes} </p>
                              </div>
                              <div
                                className={styles.singleOption}
                                onClick={() => {
                                  dispatch(getAllComments(post._id));
                                }}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                                  />
                                </svg>
                                <p>{post.commentCount}</p>
                              </div>
                              <div className={styles.singleOption}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="size-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z"
                                  />
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {postState.postId !== "" && (
              <div
                className={styles.commentsContainer}
                onClick={(e) => {
                  setCommentText("");
                  setIsComment(false);
                  dispatch(resetPostId());
                }}
              >
                <div
                  className={styles.allCommentsContainer}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {postState.comments.length == 0 && <h2>No Comments</h2>}
                  {isCommentDelete && (
                    <div className={styles.deleteCommentFlash}>
                      <p>Comment deleted</p>
                    </div>
                  )}

                  {postState.comments.length !== 0 && (
                    <div className={styles.allComments}>
                      {" "}
                      {postState.comments.map((comment, idx) => {
                        return (
                          <div
                            className={styles.singleComment}
                            key={comment._id}
                          >
                            <div
                              className={styles.singleComment_profileContainer}
                            >
                              <div className={styles.commentUser}>
                                <img
                                  src={`${BASE_URL}/${comment.userId.profilePicture}`}
                                  alt="Profile-Picture"
                                  className={styles.commentUserProfilePic}
                                ></img>
                                <div className={styles.commentUserInfo}>
                                  <p
                                    style={{
                                      fontWeight: "600",
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {comment.userId.name}
                                  </p>
                                  <p>{comment.userId.username}</p>
                                </div>
                              </div>
                              {comment.userId._id ==
                                authState.user.userId._id && (
                                <div
                                  className={styles.deleteComment}
                                  onClick={async () => {
                                    await dispatch(deleteComment(comment));
                                    await dispatch(
                                      getAllComments(postState.postId)
                                    );
                                    await dispatch(getAllPosts());
                                    setIsCommentDelete(true);

                                    setTimeout(() => {
                                      setIsCommentDelete(false);
                                    }, 2000);
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="size-6"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <p className={styles.commentBody}>{comment.body}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className={styles.postCommentContainer}>
                    <div className={styles.inputCommentWrapper}>
                      <input
                        type="text"
                        value={commentTex}
                        onChange={(e) => {
                          setIsComment(false);
                          setCommentText(e.target.value);
                        }}
                        placeholder="add comments"
                      />
                      {isComment && (
                        <p className={styles.emptyComment}>
                          Write your comment !
                        </p>
                      )}
                    </div>

                    <div className={styles.commentButtonContainer}>
                      <button
                        className={styles.commentButton}
                        onClick={async () => {
                          if (commentTex.trim() !== "") {
                            await dispatch(
                              postComment({
                                postId: postState.postId,
                                body: commentTex,
                              })
                            );
                            await dispatch(getAllComments(postState.postId));
                            await dispatch(getAllPosts());
                            setCommentText("");
                          } else {
                            setIsComment(true);
                            setCommentText("");
                          }
                        }}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {isWorkModelOpen && (
              <div
                className={styles.commentsContainer}
                onClick={() => setIsWorkModelOpen(false)}
              >
                <div
                  style={{
                    height: "fit-content",
                    textAlign: "center",
                    backgroundColor:"white"
                  }}
                  className={styles.allCommentsContainer}
                  
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {" "}
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="company"
                    name="company"
                    onChange={handleWorkInputChange}
                    required
                  ></input>
                  <input
                    className={styles.inputField}
                    type="text"
                    name="position"
                    placeholder="position"
                    onChange={handleWorkInputChange}
                    required
                  ></input>
                  <input
                    className={styles.inputField}
                    type="number"
                    name="years"
                    placeholder="years"
                    onChange={handleWorkInputChange}
                    required
                  ></input>
                  <br />
                  <button
                    className={styles.updateProfileBtn}
                    onClick={() => {
                      if (!isAnyWorkFieldEmpty) {
                        setUserProfile({
                          ...userProfile,
                          pastWork: [...userProfile.pastWork, inputData],
                        });
                        setInputData({company:"",position:"",years:""})
                      }
                      setIsWorkModelOpen(false);
                    }}
                  >
                    update Profile
                  </button>
                </div>
              </div>
            )}

            {isEducationModelOpen && (
              <div
                className={styles.commentsContainer}
                onClick={() => setIsEducationModelOpen(false)}
              >
                <form
                  onSubmit={(e) => e.preventDefault()}
                  style={{
                    height: "fit-content",
                    textAlign: "center",
                  }}
                  className={styles.allCommentsContainer}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="college"
                    name="school"
                    onChange={handleEducationInputChange}
                    required
                  ></input>
                  <input
                    className={styles.inputField}
                    type="text"
                    name="degree"
                    placeholder="degree"
                    onChange={handleEducationInputChange}
                    required
                  ></input>
                  <input
                    className={styles.inputField}
                    type="text"
                    name="fieldOfStudy"
                    placeholder="time duration & study field"
                    onChange={handleEducationInputChange}
                    required
                  />
                  <br />
                  <button
                    type="submit"
                    className={styles.updateProfileBtn}
                    onClick={() => {
                      if (!isAnyEducationFieldEmpty) {
                        setUserProfile({
                          ...userProfile,
                          education: [
                            ...userProfile.education,
                            educationInputData,
                          ],
                        });
                        setEducationInputData({school:"",degree:"",fieldOfStudy:""})
                      }
                      

                      setIsEducationModelOpen(false);
                    }}
                  >
                    update Profile
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}

export default ProfilePage;
