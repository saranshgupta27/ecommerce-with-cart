import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { CartItem } from "../types";

interface CartProps {
  cart: CartItem[];
  onCheckout: (discountCode?: string) => void;
}

export const Cart: React.FC<CartProps> = ({ cart, onCheckout }) => {
  const [discountCode, setDiscountCode] = React.useState("");
  const clearDiscountCode = () => {
    setDiscountCode("");
  };

  const subtotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Cart
      </Heading>
      <VStack align="start" spacing={2}>
        {cart.map((item) => (
          <Text key={item.product.id}>
            {item.product.name} x {item.quantity} - INR
            {(item.product.price * item.quantity).toFixed(2)}
          </Text>
        ))}
      </VStack>
      <Text fontWeight="bold" mt={4}>
        Subtotal: INR {subtotal.toFixed(2)}
      </Text>
      <Flex alignItems={"center"} mt={2}>
        <Input
          placeholder="Discount Code"
          value={discountCode}
          onChange={(e) => setDiscountCode(e.target.value)}
          w={200}
        />
        <Button
          colorScheme="red"
          onClick={clearDiscountCode}
          isDisabled={!discountCode}
        >
          Clear
        </Button>
      </Flex>

      <Button
        colorScheme="green"
        mt={4}
        onClick={() => onCheckout(discountCode)}
      >
        Checkout
      </Button>
    </Box>
  );
};
