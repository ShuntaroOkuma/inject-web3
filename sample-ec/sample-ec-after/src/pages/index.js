import Head from "next/head";
import { Top } from "@/components/Top";
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
  return (
    <main>
      <Auth>
        <Head>
          <title>inject web3</title>
          <meta name="description" content="inject-web3 sample ec site" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header />
        <Top products={products} />
      </Auth>
    </main>
  );
}
