import { sha256 } from "@/lib/hash";
import { userIdState } from "@/store/auth";
import {
  Box,
  Container,
  Flex,
  Heading,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";

const Header = () => {
  const router = useRouter();
  const [userId, setUserId] = useRecoilState(userIdState);

  // Create Flow account
  const enableWeb3 = async () => {
    // Calc username's hash to avoid exposing username on the blockchain
    const userHash = await sha256(userId);

    // Call API to create account
    const result = await fetch("http://localhost:5001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userHash: userHash }),
    }).then((response) => response.json());

    alert(
      `created web3: \n userHash: ${userHash} \n address: ${result.address}`
    );
  };

  return (
    <Box>
      <Container>
        <Flex
          as="header"
          padding={4}
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" fontSize="2xl">
            Sample EC
          </Heading>
          {userId ? (
            <Menu>
              <MenuButton>
                <Avatar name={userId} src="https://bit.ly/broken-link" />
              </MenuButton>
              <MenuList>
                <MenuItem onClick={enableWeb3}>Enable Web3</MenuItem>
                <MenuItem
                  onClick={() => {
                    router.push("/nft");
                  }}
                >
                  Check NFT
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    setUserId(null);
                    router.push("/login");
                  }}
                >
                  Log out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : null}
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;
