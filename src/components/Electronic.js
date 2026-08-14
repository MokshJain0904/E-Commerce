import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from './ProductCard';

function ElectronicSection({ products, onAddToCart }) {
  // Filter products for Electronics
  const electronicProducts = products.filter(p => p.category === 'Electronics');

  return (
    <Container className="my-4">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
        <h2 className="fw-bold text-dark mb-0">⚡ Electronics & Gadgets</h2>
        <span className="badge bg-primary fs-6">{electronicProducts.length} Items</span>
      </div>
      <Row className="g-4">
        {electronicProducts.map(product => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ElectronicSection;
