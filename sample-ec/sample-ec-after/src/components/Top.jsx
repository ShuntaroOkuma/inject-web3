import {
  Image,
  Stack,
  Button,
  Text,
  Grid,
  GridItem,
  Heading,
  Flex,
  Box,
  Spacer,
} from "@chakra-ui/react";
import { useShoppingCart } from "use-shopping-cart";
import { CartDetail } from "@/components/Cart";
import { useEffect } from "react";

export function Top(props) {
  const { products } = props;
  const { addItem, clearCart } = useShoppingCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <Stack display="flex" justifyContent="center" alignItems="center">
      <Stack direction="row" justifyContent="center" padding={5}>
        <Stack gap={3}>
          {products.map((product) => {
            return (
              <Grid
                templateAreas={`"header header"
                  "nav main"`}
                gridTemplateRows={"50px 1fr"}
                gridTemplateColumns={"500px 1fr"}
                gap="1"
                fontWeight="bold"
              >
                <GridItem pl="2" area={"header"}>
                  <Heading as="h2" size="lg">
                    {product.name}
                  </Heading>
                </GridItem>
                <GridItem pl="2" area={"nav"}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    objectFit="contain"
                  />
                </GridItem>
                <GridItem padding="2" area={"main"}>
                  <Stack>
                    <Text paddingBottom={5}>{product.description}</Text>
                    {product.prices.map((price) => {
                      return (
                        <Stack key={price.id}>
                          <Flex>
                            <Box>Price</Box>
                            <Spacer />
                            <Box>
                              {price.unit_amount.toLocaleString()}{" "}
                              {price.currency.toLocaleUpperCase()}
                            </Box>
                          </Flex>

                          {price.transform_quantity ? (
                            <small>
                              (every {price.transform_quantity.divide_by} items)
                            </small>
                          ) : null}
                          <Button
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
                            Add Cart
                          </Button>
                        </Stack>
                      );
                    })}
                  </Stack>
                </GridItem>
              </Grid>
            );
          })}
        </Stack>
        <Stack>
          <Heading>Cart</Heading>
          <CartDetail />
        </Stack>
      </Stack>
    </Stack>
  );
}
