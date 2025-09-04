import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { verifyUserToken } from "@/config/redux/action/authAction";


export function useAuth() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.replace("/login");
      return;
    }

    dispatch(verifyUserToken({ token, userId }))
      .unwrap()
      .then(() => {
        setLoading(false); // valid token
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        router.replace("/login");
      });
  }, [dispatch, router]);

  return loading;
}