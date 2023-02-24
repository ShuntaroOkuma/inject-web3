# inject-web3

既存の Web2 サービスに Web3 を簡単に導入できるライブラリ

## 背景

- Flow は walletless onboarding や HybridCustody の仕組みによってマスアダプションを目指している
- これは web2 に慣れている一般人を、Web3 の世界に入りやすくするための施作となっている
- 多くの一般人が既に登録しているサービスで自動的に Web3 の恩恵を受けている状態にすることで、より Web3 の世界への参入ハードルが下がる、と考えられる

## 目的

既存のサービスに、NFT を素早く簡単に導入できるようにする

## 概要

以下のようなサービスにて、既存のユーザーに対して裏側で自動的に Flow アカウントを生成し、サービスのアクションに応じて自由に NFT の mint などのイベントを実行できる、というイメージ。

- Amazon、Campfire、ふるさと納税のような EC サイト
- connpass や Kaggle のような無料イベントサイト
- スポーツやライブ、美術館などのチケット販売サイト

例えば、EC サイトでの商品の購入に合わせて、NFT を発行しておき、その NFT を使ってキャンペーンに参加できる、といった使い方ができる。

## 既存 Web2 サービスが Web3 を導入するメリット

- walletless onboarding の考え方により、既存ユーザーに対して自動的にアカウントを作成でき、ユーザーの操作は不要
  - ただし、ユーザーの承認は必要（勝手に商品の購入履歴をブロックチェーンに上げて欲しくない人がいるはず）
- 発行された NFT を使い、ゲームができる、イベントに参加できる、特典を得られる、などサービスを広げやすい
- サービスのコラボレーションを展開しやすい
  - ブロックチェーン上のトランザクションは公開されているため「Amazon で野球関連のグッズを 10 種類購入すると、野球のチケットをそのチームのサイトで 10%オフで購入できる」など、サイトを跨いだキャンペーンやイベントが容易
  - サービス間で Hybrid Custody を形成することで、より密なサービス連携が可能になる（そしてユーザーは引き続きウォレットを意識しないままで済む）

## ユーザーの利用イメージ

ある EC サイトに登録しているユーザーが利用する時のイメージ

- ログイン時に、Flow アカウントを作成してよいか確認を取られる
  - もしくは Home 画面に「Web3 の世界とつなぐ」というボタンが現れ、押すと上記の確認が取られる
- 商品を購入すると、決済完了画面に NFT が発行されたというメッセージが表示される
- リンクをクリックすると、NFT を確認できる画面が表示される

NFT を持っていることで得られる恩恵のイメージ

- ある商品を 10 個買ったため、特別な NFT が発行された
- プログラミング関連の書籍を Amazon で 10 冊買ったため、UDEMY の講座を 1000 円引きで購入できるようになった

## 実装イメージ

サービス特有のアクション（商品の購入、イベント会場への入場、サブスクの更新など）に反応させてトランザクションなどのブロックチェーン操作を実行させればよいため、既存コードの間に差し込むイメージ。

- 登録時や決済時に　既存のユーザー情報を元に　 Flow アカウントを生成（鍵ペアを生成し、アカウントを作成し、鍵を管理）
- ログイン時に　ユーザー情報を元に　 Flow アカウント情報を取得
- 注文完了時に　注文した商品情報を元に　 Flow アカウントに対して NFT を mint
- いつでも　ユーザー情報を元に　自分の NFT を確認（NFT の確認が容易なコンポーネントを作るイメージ）
- いつでも　ユーザー情報を元に　 HybridCutody を生成
- 決済時に　 wallet 情報を元に　 Token で決済（Stripe や Flow 決済に対応しているサービスの API を確認）

```js
import create-account from "inject-web3"

const Login = (props) => {
  login(props.username, props.password); // 既存コード
  const accountInfo = create-account(props.username) // 新規コード
  save2DB(accountInfo)// 新規コード
  return true // 既存コード
}
```

```js
const create-account = ({username}) => {
  const pub, priv = keygen()
  // fclでアカウント作成のためのトランザクションを実行
  const accountInfo = fcl.hoge()
  // privをKMSなどで管理
  return accountInfo
}
```

## 環境構築

### MongoDB

```sh
docker run -itd \
        -e MONGO_INITDB_ROOT_USERNAME=root \
        -e MONGO_INITDB_ROOT_PASSWORD=pass \
        -p 27017:27017 \
        --name mongo \
        mongo
```

### Flow emulator

- エミュレータの起動

```sh
flow emulator --contracts --simple-addresses -v
```

`--contracts` でデフォルトのコントラクトがデプロイされた状態でエミュレータが起動される。デプロイされるコントラクトはログに出力される。

`--simple-addresses` でシンプルなアドレス形態にできる。

`-v` でログを詳細に出力してくれる（log()の結果も出力してくれるようになる）。

- wallet 環境の起動

```sh
flow dev-wallet -l debug
```

- アカウント作成のシェル実行

```sh
bash setup_env.sh
```

- コントラクトのデプロイ

```sh
flow deploy
```

### アプリ

```sh
cd sample-ec
npm i
npm run dev
```
