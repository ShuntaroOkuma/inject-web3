# inject-web3 API

This is the body of this repository.

This inject-web3 has 2 main functions.

1. Account

- Create account: POST request to `http://localhost:5001/users`
- Get the account info: GET request to `http://localhost:5001/users/:id`
- Get all accounts: GET request to `http://localhost:5001/users-all`

2. NFT

- Mint NFT: POST request to `http://localhost:5001/nfts`
- Get user's nfts: GET request to `http://localhost:5001/users/:id/nft`

# How to run inject-web3 API

You neet change dir to `inject-web3/inject-web3`.

## local

- Set env

```sh
cp src/flow/config.js.local src/flow/config.js
cp env.local .env
```

- Run emulator

```sh
flow emulator --contracts --simple-addresses -v
```

- Run shell to create accounts

```sh
cd ..
bash setup_env.sh
```

- deploy contracts

```sh
flow deploy
```

- Run mongodb

```sh
docker run -itd \
        -e MONGO_INITDB_ROOT_USERNAME=root \
        -e MONGO_INITDB_ROOT_PASSWORD=pass \
        -p 27017:27017 \
        --name mongo \
        mongo
```

- Run web app

```sh
npm install
nodemon
```

## testnet

- Set env

Create `.env.testnet` file referring to `env.local` file

```sh
cp src/flow/config.js.testnet src/flow/config.js
cp .env.testnet .env
```

- Run mongodb

```sh
docker run -itd \
        -e MONGO_INITDB_ROOT_USERNAME=root \
        -e MONGO_INITDB_ROOT_PASSWORD=pass \
        -p 27017:27017 \
        --name mongo \
        mongo
```

- Run web app

```sh
npm install
nodemon
```
