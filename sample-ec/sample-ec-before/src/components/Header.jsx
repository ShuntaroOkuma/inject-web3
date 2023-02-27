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
import Cookies from "js-cookie";
import { useRouter } from "next/router";

const Header = ({ username = undefined, setLoggedIn = undefined }) => {
  const router = useRouter();
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
          {username ? (
            <Menu>
              <MenuButton>
                <Avatar name={username} src="https://bit.ly/broken-link" />
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    setLoggedIn("");
                    Cookies.remove("signedIn");
                    router.replace("/login");
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
