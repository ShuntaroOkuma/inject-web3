import { useRouter } from "next/router";
import { userIdState } from "@/store/auth";
import { useRecoilValue } from "recoil";

const Auth = ({ children }) => {
  const router = useRouter();

  const userId = useRecoilValue(userIdState);

  console.log("userId: ", userId);

  if (userId === null) {
    router.replace("/login");
  }

  return children;
};

export default Auth;
