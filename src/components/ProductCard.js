import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';

// Reusable Product Card Component with Rupee ₹ Pricing & Additional Fields
function ProductCard({ product, onAddToCart }) {
  return (
    <Card className="h-100 product-card shadow-sm border-0">
      {/* Product Image Container */}
      <div className="product-img-wrapper position-relative">
        {product.badge && (
          <span className="position-absolute top-0 start-0 m-2 badge bg-danger text-white rounded-pill">
            {product.badge}
          </span>
        )}
        {product.stock <= 10 && (
          <span className="position-absolute top-0 end-0 m-2 badge bg-warning text-dark rounded-pill">
            Only {product.stock} left!
          </span>
        )}
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.name}
          className="product-card-img"
        />
      </div>

      {/* Product Details */}
      <Card.Body className="d-flex flex-column">
        {/* Brand & Category */}
        <div className="d-flex justify-content-between align-items-center text-muted small mb-1">
          <span className="fw-bold text-primary">{product.brand}</span>
          <Badge bg="light" text="dark" className="border">{product.category}</Badge>
        </div>

        <Card.Title className="fs-6 fw-bold mb-1 text-truncate" title={product.name}>
          {product.name}
        </Card.Title>
        
        <Card.Text className="text-muted small flex-grow-1 line-clamp-2 mb-2">
          {product.description}
        </Card.Text>

        {/* Rating & Delivery Info */}
        <div className="d-flex align-items-center justify-content-between mb-2 small">
          <div className="d-flex align-items-center">
            <span className="text-warning me-1">★ {product.rating}</span>
            <span className="text-muted">({product.reviews})</span>
          </div>
          {product.delivery && (
            <span className="text-success fw-semibold">🚚 {product.delivery}</span>
          )}
        </div>

        {/* Price in Rupees ₹ & Action Button */}
        <div className="d-flex align-items-center justify-content-between pt-2 border-top mt-auto">
          <div>
            <span className="fs-5 fw-bold text-dark">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <span className="text-muted text-decoration-line-through small ms-2">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-pill px-3 fw-bold"
            onClick={() => onAddToCart(product)}
          >
            + Add
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
