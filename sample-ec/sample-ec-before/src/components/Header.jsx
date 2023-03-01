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
