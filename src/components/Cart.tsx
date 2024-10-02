import {
  Button,
  Flex,
  Heading,
  Img,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { CartItem, DiscountCode } from "../types";
import CouponModal from "./CouponModal";

interface CartProps {
  cart: CartItem[];
  onCheckout: (discountCode?: string) => void;
  availableDiscountCodes: DiscountCode[] | [];
}

export const Cart: React.FC<CartProps> = ({
  cart,
  onCheckout,
  availableDiscountCodes,
}) => {
  const [discountCode, setDiscountCode] = useState("");
  const clearDiscountCode = () => {
    setDiscountCode("");
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  useEffect(() => {
    setDiscountCode("");
  }, [availableDiscountCodes]);

  return (
    <>
      <Heading as="h2" size="lg" mb={4}>
        Cart
      </Heading>
      <Flex
        height={"100%"}
        flexDirection={"column"}
        justifyContent={"space-between"}
      >
        <VStack align="start" spacing={2} overflowX={"auto"} height="100%">
          {cart.length === 0 ? (
            <Flex
              width={"100%"}
              height={"100%"}
              justifyContent="center"
              alignItems={"center"}
              textAlign={"center"}
            >
              Your cart is empty
            </Flex>
          ) : (
            cart.map((item) => (
              <Flex
                key={item.product.id}
                alignItems={"center"}
                width={"100%"}
                justifyContent={"space-between"}
              >
                <Flex alignItems={"center"}>
                  <Img
                    height={50}
                    w={50}
                    src={item.product.image}
                    alt={item.product.name}
                    onError={({ currentTarget }) => {
                      currentTarget.onerror = null;
                      currentTarget.src =
                        "https://icons.veryicon.com/png/o/education-technology/alibaba-cloud-iot-business-department/image-load-failed.png";
                    }}
                  />
                  <Flex gap={2}>
                    <Text>{item.product.name}</Text>
                    <Text>X</Text>
                    <Text>{item.quantity}</Text>
                  </Flex>
                </Flex>
                <Text>
                  INR {(item.product.price * item.quantity).toFixed(2)}
                </Text>
              </Flex>
            ))
          )}
        </VStack>
        <Flex flexDirection={"column"}>
          <Flex alignItems={"center"} mt={2} width={"100%"} gap={2}>
            <Input
              placeholder="Discount Code"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
            />
            <Button
              colorScheme="red"
              onClick={clearDiscountCode}
              isDisabled={!discountCode}
            >
              Clear
            </Button>
            <CouponModal
              isCartEmpty={cart.length === 0}
              coupons={availableDiscountCodes}
              onApplyCoupon={(couponCode: string) => {
                setDiscountCode(couponCode);
              }}
            />
          </Flex>

          <Text fontWeight="bold" mt={4}>
            Subtotal: INR {subtotal.toFixed(2)}
          </Text>

          <Button
            colorScheme="green"
            mt={4}
            onClick={() => onCheckout(discountCode)}
          >
            Checkout
          </Button>
        </Flex>
      </Flex>
    </>
  );
};
