import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';

function OrdersModal({ show, onHide, user }) {
  const [emailInput, setEmailInput] = useState(user?.email || '');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const fetchOrders = async (searchEmail) => {
    if (!searchEmail) return;
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders?email=${encodeURIComponent(searchEmail)}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      const initialEmail = user?.email || emailInput || 'user@example.com';
      if (user?.email) setEmailInput(user.email);
      fetchOrders(initialEmail);
    }
  }, [show, user]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrders(emailInput.trim());
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="orders-modal">
      <Modal.Header closeButton className="bg-light">
        <Modal.Title className="fw-bold fs-4 text-dark">
          📦 My Order History & Track Status
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Email Search Filter Bar */}
        <Form onSubmit={handleSearchSubmit} className="mb-4">
          <Form.Group className="d-flex gap-2">
            <Form.Control
              type="email"
              placeholder="Enter your email address to find orders..."
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="form-control-lg fs-6"
              required
            />
            <Button variant="primary" type="submit" className="px-4 fw-bold">
              Search
            </Button>
          </Form.Group>
        </Form>

        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading your orders ...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div className="fs-1 mb-2">🛍️</div>
            <h5>{searched ? 'No orders found for this email address.' : 'Enter email to track orders.'}</h5>
            <p className="small">Make sure you enter the exact email used during checkout.</p>
          </div>
        ) : (
          <div className="d-flex flex-column gap-3" style={{ maxHeight: '460px', overflowY: 'auto' }}>
            {orders.map((order, idx) => (
              <Card key={order._id || idx} className="shadow-sm border">
                <Card.Header className="bg-white d-flex flex-wrap justify-content-between align-items-center py-2">
                  <div>
                    <span className="fw-bold me-2">Order ID:</span>
                    <span className="font-monospace text-primary">{order._id}</span>
                    <div className="text-muted small">
                      📅 {order.createdAt ? new Date(order.createdAt).toLocaleString('en-IN') : 'Recently Placed'}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0">
                    <Badge bg="success" className="px-2 py-1">
                      💳 Paid (₹{order.totalPrice?.toLocaleString('en-IN')})
                    </Badge>
                    <Badge bg="info" text="dark" className="px-2 py-1">
                      🚚 {order.isDelivered ? 'Delivered' : 'Processing / Dispatched'}
                    </Badge>
                  </div>
                </Card.Header>

                <Card.Body className="py-2">
                  <ListGroup variant="flush">
                    {order.orderItems?.map((item, itemIdx) => (
                      <ListGroup.Item key={itemIdx} className="d-flex align-items-center justify-content-between px-0 py-2 border-0">
                        <div className="d-flex align-items-center">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '6px' }}
                              className="me-3"
                            />
                          )}
                          <div>
                            <div className="fw-semibold text-dark">{item.name}</div>
                            <small className="text-muted">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</small>
                          </div>
                        </div>
                        <span className="fw-bold text-dark">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>

                <Card.Footer className="bg-light d-flex justify-content-between align-items-center py-2 small">
                  <div>
                    <span className="text-muted">Payment: </span>
                    <strong>{order.paymentMethod || 'UPI / Card'}</strong>
                  </div>
                  <div>
                    <span className="text-muted">Txn ID: </span>
                    <span className="font-monospace fw-semibold">{order.paymentResult?.transactionId || 'TXN_SWIFT'}</span>
                  </div>
                </Card.Footer>
              </Card>
            ))}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="bg-light">
        <Button variant="secondary" onClick={onHide} className="fw-semibold">
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default OrdersModal;
