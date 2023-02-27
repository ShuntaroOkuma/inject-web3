import {
  Stack,
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
  Button,
  Text,
  Heading,
  Spacer,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { useShoppingCart } from "use-shopping-cart";

export function CartDetail() {
  const { cartDetails, removeItem, formattedTotalPrice, clearCart, cartCount } =
    useShoppingCart();

  const router = useRouter();

  const handleOrder = async () => {
    try {
      const session = await fetch(
        "http://localhost:3000/api/checkout_session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: Object.entries(cartDetails).map(([_id, detail]) => ({
              id: detail.id,
              quantity: detail.quantity,
            })),
          }),
        }
      ).then((response) => response.json());

      router.push(session.url);
    } catch (e) {
      window.alert(e.message);
    }
  };

  return (
    <Stack gap={1}>
      {Object.entries(cartDetails).map(([priceId, detail]) => {
        return (
          <Card key={priceId}>
            <CardHeader display="flex">
              <Heading size="md">{detail.name}</Heading>
              <Spacer />
              <Button onClick={() => removeItem(priceId)}>
                <CloseIcon />
              </Button>
            </CardHeader>
            <CardBody>
              {detail.formattedPrice} * {detail.quantity} ={" "}
              {detail.formattedValue} {detail.currency}
            </CardBody>
          </Card>
        );
      })}
      <Card>
        <CardBody>
          <Text>
            Cart Subtotal: <b>{formattedTotalPrice}</b>
          </Text>
          <Text>
            Cart count: <b>{cartCount}</b>
          </Text>
          {cartCount > 0 ? (
            <ButtonGroup paddingTop={5}>
              <Button color="green.100" onClick={handleOrder}>
                Checkout
              </Button>

              <Button color="grey.100" onClick={() => clearCart()}>
                Clear cart
              </Button>
            </ButtonGroup>
          ) : null}
        </CardBody>
      </Card>
    </Stack>
  );
}
