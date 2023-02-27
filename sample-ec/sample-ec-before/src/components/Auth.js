import { useRouter } from "next/router";
import Cookies from "js-cookie";

const Auth = ({ setLoggedIn, children }) => {
  const router = useRouter();

  const signedIn = Cookies.get("signedIn");

  if (!signedIn) {
    router.replace("/login");
  } else {
    setLoggedIn(signedIn);
  }

  return children;
};

export default Auth;
