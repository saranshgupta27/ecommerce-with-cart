import {
  Box,
  Button,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Product } from "../types";

interface ProductListProps {
  products: Product[];
  onAddToCart: (productId: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  onAddToCart,
}) => {
  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>
        Products
      </Heading>
      <SimpleGrid columns={3} spacing={4}>
        {products.map((product) => (
          <Box key={product.id} borderWidth={1} borderRadius="lg" p={4}>
            <VStack align="start">
              <Text fontWeight="bold">{product.name}</Text>
              <Text>INR {product.price.toFixed(2)}</Text>
              <Button
                colorScheme="blue"
                onClick={() => onAddToCart(product.id)}
              >
                Add to Cart
              </Button>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
