import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProductCard from './ProductCard';

function EducationSection({ products, onAddToCart }) {
  // Filter products for Education
  const educationProducts = products.filter(p => p.category === 'Education');

  return (
    <Container className="my-4">
      <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
        <h2 className="fw-bold text-dark mb-0">📚 Books & Learning Material</h2>
        <span className="badge bg-warning text-dark fs-6">{educationProducts.length} Items</span>
      </div>
      <Row className="g-4">
        {educationProducts.map(product => (
          <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} onAddToCart={onAddToCart} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default EducationSection;
