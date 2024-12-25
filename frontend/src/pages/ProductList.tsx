import React, { useState, useEffect } from 'react';
import { Button, TextInput, Container, Grid } from '@mantine/core';
import ProductCard from '../components/ProductCard';

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
const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [filter, setFilter] = useState({ price: '', category: '', title: '' });

    useEffect(() => {
        fetch('http://localhost:8000/api/products/')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
                setFilteredProducts(data);
            });
    }, []);

    const addToCart = (product: Product) => {
        console.log('Added to cart:', product);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    const applyFilters = () => {
        let filtered = products;
        if (filter.price) {
            filtered = filtered.filter(product => product.price <= parseFloat(filter.price));
        }
        if (filter.category) {
            filtered = filtered.filter(product => product.category === filter.category);
        }
        if (filter.title) {
            filtered = filtered.filter(product => product.title.toLowerCase().includes(filter.title.toLowerCase()));
        }
        setFilteredProducts(filtered);
    };

    return (
        <Container>
            <Grid align="center" style={{ marginBottom: '20px' }}>
                <TextInput
                    placeholder="Filter by title"
                    name="title"
                    value={filter.title}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <TextInput
                    placeholder="Filter by price"
                    name="price"
                    value={filter.price}
                    onChange={handleFilterChange}
                    style={{ marginRight: '10px' }}
                />
                <Button onClick={applyFilters}>Apply Filters</Button>
            </Grid>
            <Grid>
                {filteredProducts.map((product) => (
                    <Grid.Col key={product.id} span={6}>
                        <ProductCard product={product} onAddToCart={addToCart} />
                    </Grid.Col>
                ))}
            </Grid>
        </Container>
    );
};

export default ProductList;
