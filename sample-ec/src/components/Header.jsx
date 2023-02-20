import NextLink from "next/link";
import { Box, Container, Flex, Heading, Button } from "@chakra-ui/react";
import { CreateWeb3Account } from "@/components/CreateWeb3Account";

const Header = ({ username }) => {
  return (
    <Box px={4} bgColor="gray.100">
      <Container maxW="container.lg">
        <Flex
          as="header"
          py="4"
          justifyContent="space-between"
          alignItems="center"
        >
          <Heading as="h1" fontSize="2xl" cursor="pointer">
            Sample EC
          </Heading>
          {username ? (
            <NextLink href="/create-web3-account" passHref>
              <Heading as="h3" fontSize="xs" cursor="pointer">
                Create Web3 Account
              </Heading>
            </NextLink>
          ) : null}
        </Flex>
        <Box>Logged In: {username}</Box>
      </Container>
    </Box>
  );
};

export default Header;
