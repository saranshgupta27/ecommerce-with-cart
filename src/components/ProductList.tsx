import {
  Box,
  Button,
  Heading,
  Img,
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
      <Heading as="h2" size="lg" my={4}>
        Products
      </Heading>
      <SimpleGrid columns={3} spacing={4}>
        {products.map((product) => (
          <Box
            key={product.id}
            borderWidth={1}
            borderRadius="lg"
            p={4}
            boxShadow={"rgba(0, 0, 0, 0.1) 0px 4px 12px"}
          >
            <VStack align="center">
              <Img
                height={160}
                src={product.image}
                alt={product.name}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null;
                  currentTarget.src =
                    "https://icons.veryicon.com/png/o/education-technology/alibaba-cloud-iot-business-department/image-load-failed.png";
                }}
              />
              <Text fontWeight="bold">{product.name}</Text>
              <Text>₹ {product.price.toFixed(2)}</Text>
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
