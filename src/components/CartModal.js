import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

function CartModal({ show, onHide, cart, onUpdateQuantity, onRemoveItem, onProceedToPayment }) {
  // Calculate total cart price in Rupees
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold">🛒 Your Shopping Cart</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {cart.length === 0 ? (
          <div className="text-center py-4 text-muted">
            <h5>Your cart is empty!</h5>
            <p>Explore our products and add items to your cart.</p>
          </div>
        ) : (
          <ListGroup variant="flush">
            {cart.map((item) => (
              <ListGroup.Item
                key={item.id}
                className="d-flex align-items-center justify-content-between py-3"
              >
                <div className="d-flex align-items-center me-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                    className="me-3"
                  />
                  <div>
                    <h6 className="mb-0 fw-bold">{item.name}</h6>
                    <small className="text-muted">₹{item.price.toLocaleString('en-IN')} each</small>
                    {item.brand && <div className="badge bg-light text-dark border ms-2">{item.brand}</div>}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  {/* Quantity Controls */}
                  <div className="d-flex align-items-center border rounded">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </Button>
                    <span className="px-3 fw-bold">{item.quantity}</span>
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </Button>
                  </div>

                  {/* Item Subtotal */}
                  <span className="fw-bold text-primary style-price" style={{ minWidth: '100px', textAlign: 'right' }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </span>

                  {/* Remove Button */}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onRemoveItem(item.id)}
                  >
                    🗑️
                  </Button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>

      {cart.length > 0 && (
        <Modal.Footer className="d-flex justify-content-between bg-light">
          <div className="fs-5 fw-bold">
            Total: <span className="text-primary">₹{totalPrice.toLocaleString('en-IN')}</span>
          </div>
          <div>
            <Button variant="outline-secondary" className="me-2" onClick={onHide}>
              Continue Shopping
            </Button>
            <Button variant="success" className="fw-bold" onClick={onProceedToPayment}>
              Proceed to Payment 💳
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
}

export default CartModal;
