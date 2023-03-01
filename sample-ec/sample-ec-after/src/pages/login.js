import { useState } from "react";
import { useRouter } from "next/router";
import { Flex, Box, Button, Input } from "@chakra-ui/react";
import Header from "@/components/Header";
import { userIdState } from "@/store/auth";
import { useRecoilState } from "recoil";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [userAuth, setUserAuth] = useRecoilState(userIdState);

  const onClickLogin = async () => {
    // TODO: Implement login process
    // The implementation of the login process is necessary here, but since it is a sample, it is passed.
    setUserAuth(userId);
    router.push("/");
  };

  return (
    <>
      <Header />
      <Flex
        display="flex"
        direction={"column"}
        alignItems="center"
        justifyContent="center"
        padding={5}
      >
        <Box margin={3}>
          <Input
            id="userId"
            type="email"
            label="userId"
            placeholder="User ID"
            onChange={(e) => setUserId(e.target.value)}
          />
        </Box>
        <Box margin={3}>
          <Input
            id="password"
            type="password"
            label="Password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box margin={3}>
          <Button variant="solid" color="white" onClick={onClickLogin}>
            Login
          </Button>
        </Box>
      </Flex>
    </>
  );
}
