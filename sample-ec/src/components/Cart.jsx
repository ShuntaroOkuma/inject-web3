import {
  Stack,
  Card,
  CardBody,
  CardHeader,
  ButtonGroup,
  Button,
  Text,
} from "@chakra-ui/react";
import { useShoppingCart } from "use-shopping-cart";

export function CartDetail() {
  const { cartDetails, removeItem, formattedTotalPrice, clearCart, cartCount } =
    useShoppingCart();
  return (
    <Stack gap={1}>
      {Object.entries(cartDetails).map(([priceId, detail]) => {
        return (
          <Card key={priceId}>
            <CardHeader>{detail.name}</CardHeader>
            <CardBody>
              {detail.formattedPrice} * {detail.quantity} ={" "}
              {detail.formattedValue} {detail.currency}
            </CardBody>
            <ButtonGroup>
              <Button
                variant="outline-danger"
                onClick={() => removeItem(priceId)}
              >
                削除
              </Button>
            </ButtonGroup>
          </Card>
        );
      })}
      <Card>
        <CardHeader>合計</CardHeader>
        <CardBody>
          <Text>{formattedTotalPrice}</Text>
          <ButtonGroup>
            <Button
              variant="primary"
              disabled={cartCount < 1}
              onClick={async () => {
                try {
                  const session = await fetch(
                    "http://localhost:3000/api/checkout_session",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        items: Object.entries(cartDetails).map(
                          ([_id, detail]) => ({
                            id: detail.id,
                            quantity: detail.quantity,
                          })
                        ),
                      }),
                    }
                  ).then((response) => response.json());
                  window.open(session.url);
                } catch (e) {
                  window.alert(e.message);
                }
              }}
            >
              注文する
            </Button>
            <Button variant="outline-danger" onClick={() => clearCart()}>
              カートを空にする
            </Button>
          </ButtonGroup>
        </CardBody>
      </Card>
    </Stack>
  );
}
