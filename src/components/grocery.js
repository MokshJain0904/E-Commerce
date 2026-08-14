import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from './ProductCard';

function GrocerySection({ products, onAddToCart }) {
  // Filter products for Grocery
  const groceryProducts = products.filter(p => p.category === 'Grocery');

  return (
    <Container className="my-4">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
        <h2 className="fw-bold text-dark mb-0">🛒 Fresh Grocery & Essentials</h2>
        <span className="badge bg-success fs-6">{groceryProducts.length} Items</span>
      </div>
      <Row className="g-4">
        {groceryProducts.map(product => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default GrocerySection;
