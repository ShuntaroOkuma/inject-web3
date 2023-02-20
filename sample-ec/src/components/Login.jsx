import { memo, useState } from "react";
import Router from "next/router";
import { Box, Button, Input } from "@chakra-ui/react";

export const Login = memo((props) => {
  const { setLoggedIn } = props;
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const onClickLogin = async () => {
    // TODO: Imple login process
    console.log(userId, password);
    /**
     * injection point: userIdに対応したFlowアカウントのアドレスを取得する
     **/
    const addr = "0x05"; // Alice

    setLoggedIn(addr);

    Router.push("#home");
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding={20}
    >
      <Box>
        <Input
          id="username"
          type="email"
          label="Username"
          placeholder="Username"
          margin="5px"
          onChange={(e) => setUserId(e.target.value)}
        />
      </Box>
      <Box>
        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="Password"
          margin="5px"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Button
          variant="contained"
          size="large"
          color="secondary"
          onClick={onClickLogin}
        >
          Login
        </Button>
      </Box>
    </Box>
  );
});
