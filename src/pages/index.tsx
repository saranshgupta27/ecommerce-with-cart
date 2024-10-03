import { Box, Container, Flex, useToast } from "@chakra-ui/react";
import React from "react";
import { AdminPanel } from "../components/AdminPanel";
import { Cart } from "../components/Cart";
import { ProductList } from "../components/ProductList";
import { useAdminStats } from "../hooks/useAdminStats";
import { useCart } from "../hooks/useCart";
import { useProducts } from "../hooks/useProducts";

const Home: React.FC = () => {
  const products = useProducts();
  const { cart, addToCart, deleteItem, resetCart } = useCart();
  const { adminStats, resetStats, refreshAdminStats } = useAdminStats();
  const toast = useToast();

  const handleAddToCart = async (productId: number) => {
    await addToCart(productId);
    toast({
      title: "Item added to cart",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleCheckout = async (discountCode?: string) => {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ discountCode }),
    });
    const data = await response.json();
    if (response.ok) {
      toast({
        title: "Order placed successfully",
        description: `Total: ₹ ${data.total.toFixed(2)}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      resetCart();
      refreshAdminStats();
    } else {
      toast({
        title: "Checkout failed",
        description: data.error,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={"14"}>
      <Flex direction={{ base: "column", md: "row" }} gap={8} height={"100%"}>
        <Box flex={2} height={"max-content"}>
          <ProductList products={products} onAddToCart={handleAddToCart} />
        </Box>
        <Box>
          <Flex
            direction={"column"}
            justifyContent={"space-between"}
            height={"100%"}
            maxH={"100%"}
          >
            <Cart
              cart={cart}
              onCheckout={handleCheckout}
              availableDiscountCodes={adminStats.discountCodes.filter(
                (dc) => !dc.isInvalid
              )}
              onDeleteItem={deleteItem}
            />
            <AdminPanel adminStats={adminStats} onReset={resetStats} />
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
};

export default Home;
