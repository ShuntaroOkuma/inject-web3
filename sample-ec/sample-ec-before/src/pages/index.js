import Head from "next/head";
import { Top } from "@/components/Top";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Auth from "@/components/Auth";

export async function getStaticProps() {
  const products = await fetch("http://localhost:3000/api/products").then(
    (response) => response.json()
  );
  return {
    props: {
      products,
    },
    revalidate: 1 * 60,
  };
}

export default function Home({ products }) {
  const [loggedIn, setLoggedIn] = useState("");

  useEffect(() => {}, []);

  return (
    <main>
      <Auth setLoggedIn={setLoggedIn}>
        <Head>
          <title>inject web3</title>
          <meta name="description" content="inject-web3 sample ec site" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header username={loggedIn} setLoggedIn={setLoggedIn} />
        <Top products={products} />
      </Auth>
    </main>
  );
}
