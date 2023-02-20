import { Image, Stack, Button, Text } from "@chakra-ui/react";
import { useShoppingCart } from "use-shopping-cart";
import { CartDetail } from "@/components/Cart";

export function Top(props) {
  const { products } = props;
  const { addItem } = useShoppingCart();

  return (
    <Stack direction="row" padding={5}>
      <Stack gap={3}>
        {products.map((product) => {
          return (
            <Stack key={product.id} direction="row">
              <Stack xs={4}>
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  boxSize="300px"
                  objectFit="contain"
                />
              </Stack>
              <Stack>
                <Stack gap={3}>
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
                </Stack>
                <Stack>
                  {product.prices.map((price) => {
                    return (
                      <Stack key={price.id}>
                        <Text as="b">価格</Text>
                        <span>
                          {price.unit_amount.toLocaleString()}{" "}
                          {price.currency.toLocaleUpperCase()}
                        </span>
                        {price.transform_quantity ? (
                          <small>
                            ({price.transform_quantity.divide_by}
                            アイテム毎)
                          </small>
                        ) : null}
                        <form action="/api/checkout_session" method="POST">
                          <input type="hidden" name="price" value={price.id} />
                          <input type="hidden" name="quantity" value={1} />
                          <Button>いますぐ注文する</Button>
                        </form>
                        <Button
                          colorScheme="teal"
                          size="xs"
                          onClick={() =>
                            addItem({
                              id: price.id,
                              name: product.name,
                              price: price.unit_amount,
                              currency: price.currency,
                              image: product.images[0],
                            })
                          }
                        >
                          カートに追加する
                        </Button>
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Stack>
          );
        })}
      </Stack>
      <Stack>
        <CartDetail />
      </Stack>
    </Stack>
  );
}
