import { getAboutUser, getAllUsers } from "@/config/redux/action/authAction";
import {
  createPost,
  deleteComment,
  deletePost,
  getAllComments,
  getAllPosts,
  incrementLikes,
  incrementPostLikes,
  postComment,
} from "@/config/redux/action/postAction";
import UserLayout from "@/layout/UserLayout";
import { useRouter } from "next/router";
import styles from "./style.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "@/layout/DashboardLayout";
import { setIsToken } from "@/config/redux/reducer/authReducer";
import { BASE_URL } from "@/config";
import { resetPostId } from "@/config/redux/reducer/postReducer";

function DashboardComponent() {
  const router = useRouter();
  const authState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.posts);

  const [commentTex, setCommentText] = useState("");

  useEffect(() => {
    if (authState.isToken) {
      dispatch(getAllPosts());
      dispatch(
        getAboutUser({
          token: localStorage.getItem("token"),
        })
      );
    }
    if (!authState.allProfileFetched) {
      dispatch(getAllUsers());
    }
  }, [authState.isToken]);

  const [postContent, setPostContent] = useState("");
  const [fileContent, setFileContent] = useState();
  const [isComment, setIsComment] = useState(false);
  const [isCommentDelete, setIsCommentDelete] = useState(false);

  const handleUpload = async () => {
    await dispatch(createPost({ file: fileContent, body: postContent }));
    setPostContent("");
    setFileContent("");
    dispatch(getAllPosts());
  };

  if (authState.profileFetch) {
    return (
      <UserLayout>
        <DashboardLayout>
          <div className={styles.scrollPannel}>
            <div className={styles.wrapper}>
              <div className={styles.createPostContainer}>
                <img
                  src={`${BASE_URL}/${authState.user.userId.profilePicture}`}
                  className={styles.userProfile}
                />
                <textarea
                  className={styles.textArea}
                  placeholder="what's in your mind"
                  value={postContent}
                  onChange={(e) => {
                    setPostContent(e.target.value);
                  }}
                ></textarea>
                <label htmlFor="fileupload">
                  <div className={styles.Fab}>
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
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                  </div>
                </label>
                <input
                  type="file"
                  hidden
                  id="fileupload"
                  onChange={(e) => setFileContent(e.target.files[0])}
                />
                {postContent.trim().length > 0 && (
                  <button
                    className={styles.uploadButton}
                    onClick={handleUpload}
                  >
                    Post
                  </button>
                )}
              </div>
              <div className={styles.postContainer}>
                {postState.posts.map((post) => {
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
            </div>
          </div>
          {console.log(postState.postId)}
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
                        <div className={styles.singleComment} key={comment._id}>
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
        </DashboardLayout>
      </UserLayout>
    );
  } else {
    return (
      <UserLayout>
        <DashboardLayout>
          <h1>Loading...</h1>
        </DashboardLayout>
      </UserLayout>
    );
  }
}

export default DashboardComponent;
