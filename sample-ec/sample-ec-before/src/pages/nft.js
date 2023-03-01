import { sha256 } from "@/lib/hash";
import Header from "@/components/Header";
import { userIdState } from "@/store/auth";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Nft() {
  const userId = useRecoilValue(userIdState);
  const [userHash, setUserHash] = useState("");
  const [address, setAddress] = useState("");
  const [nfts, setNfts] = useState([]);
  const router = useRouter();

  const getNFT = async () => {
    const userHash = await sha256(userId);
    const json = await fetch(
      `http://localhost:5001/users/${userHash}/nft`
    ).then((response) => response.json());

    setUserHash(json.userHash);
    setAddress(json.address);
    setNfts(json.nfts);
  };

  useEffect(() => {
    getNFT();
  }, []);

  const NftList = () => {
    return (
      <>
        <Stack padding={5}>
          <Text>User Hash: {userHash ? userHash : null}</Text>
          <Text>Flow Address: {address ? address : null}</Text>
        </Stack>
        <Stack padding={5}>
          {nfts
            ? nfts.map((nft) => {
                return (
                  <Card>
                    <CardHeader>{nft.name}</CardHeader>
                    <CardBody>{JSON.stringify(nft.metadata)}</CardBody>
                  </Card>
                );
              })
            : null}
        </Stack>
        <Stack direction="row" justifyContent="center" alignItems="center">
          <Button onClick={() => router.push("/")}>HOME</Button>
        </Stack>
      </>
    );
  };
  return (
    <>
      <Header />
      <NftList />
    </>
  );
}
