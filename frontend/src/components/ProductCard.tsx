// src/components/ProductCard.tsx
import React from 'react';
import { Card, Image, Text, Button, Group } from '@mantine/core';

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    created_at: string;
    updated_at: string;
    farmer_name: string;
}

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
                <Card.Section>
                    <Image 
                        src={ `https://via.placeholder.com/150?text=${product.title}`} 
                        alt={product.title} 
                        height={150} 
                        width="100%"
                    />
                </Card.Section>

                <Group mt="md">
                    <Text>{product.title}</Text>
                    <Text>${product.price}</Text>
                </Group>

                <Text size="sm" color="dimmed" mt="xs">
                    {product.description}
                </Text>

                <Text size="sm" mt="xs">
                    Stock: {product.stock}
                </Text>

                <Text size="sm" mt="xs">
                    Farmer: {product.farmer_name}
                </Text>

                <Group mt="xs">
                    <Text size="xs" color="dimmed">
                        Created at: {new Date(product.created_at).toLocaleDateString()}
                    </Text>
                    <Text size="xs" color="dimmed">
                        Updated at: {new Date(product.updated_at).toLocaleDateString()}
                    </Text>
                </Group>
            </div>

            <Button
                fullWidth
                mt="md"
                onClick={() => onAddToCart(product)}
                disabled={product.stock === 0}
            >
                {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
        </Card>
    );
};

export default ProductCard;

