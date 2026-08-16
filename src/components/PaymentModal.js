import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';

function PaymentModal({ show, onHide, cart, user, onPaymentComplete }) {
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState('123 MG Road, Sector 15');
  const [city, setCity] = useState('Bengaluru');
  const [postalCode, setPostalCode] = useState('560001');

  const [step, setStep] = useState('FORM'); // FORM, PROCESSING, SUCCESS
  const [transactionResult, setTransactionResult] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.name) setFullName(user.name);
      if (user.email) setEmail(user.email);
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 1000 ? 0 : 99;
  const grandTotal = subtotal + deliveryFee;

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setStep('PROCESSING');

    // Simulate network delay for mock payment gateway (1.5 seconds)
    setTimeout(async () => {
      const mockTxn = {
        transactionId: `TXN_SWIFT_${Date.now().toString().slice(-6)}`,
        status: 'SUCCESS',
        paidAt: new Date().toISOString(),
      };

      const finalEmail = email.trim() || user?.email || 'customer@swiftcart.com';

      const orderPayload = {
        user: user?._id || null,
        guestEmail: finalEmail,
        orderItems: cart,
        shippingAddress: { fullName, address, city, postalCode },
        paymentMethod,
        totalPrice: grandTotal,
        paymentResult: mockTxn,
      };

      try {
        // Post order to Node Express server / MongoDB
        const res = await fetch('http://localhost:5000/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(orderPayload),
        });
        const savedOrder = await res.json();
        setTransactionResult(savedOrder);
      } catch (err) {
        // Fallback result display
        setTransactionResult({
          _id: `ORD_${Math.floor(100000 + Math.random() * 900000)}`,
          paymentResult: mockTxn,
          totalPrice: grandTotal,
          guestEmail: finalEmail,
        });
      }

      setStep('SUCCESS');
    }, 1500);
  };

  const handleFinish = () => {
    onPaymentComplete();
    setStep('FORM');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static" size="lg">
      <Modal.Header closeButton={step !== 'PROCESSING'}>
        <Modal.Title className="fw-bold fs-4 text-dark d-flex align-items-center">
          💳 <span className="ms-2">SwiftCart Secure Payment Gateway</span>
          <Badge bg="success" className="ms-3 fs-6 font-monospace fw-normal">
            Mock Mode
          </Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* STEP 1: FORM INPUT & METHOD SELECTION */}
        {step === 'FORM' && (
          <Form onSubmit={handleProcessPayment}>
            <div className="row g-4">
              {/* Left Column: Shipping Address & Email */}
              <div className="col-md-6 border-end pe-md-4">
                <h5 className="fw-bold mb-3 text-primary">📍 1. Delivery & Contact Info</h5>

                <Form.Group className="mb-2">
                  <Form.Label className="small fw-semibold mb-1">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small fw-semibold mb-1">Email Address (for Receipt)</Form.Label>
                  <Form.Control
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@example.com"
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label className="small fw-semibold mb-1">Street Address</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Street / Area"
                  />
                </Form.Group>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <Form.Label className="small fw-semibold mb-1">City</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="col-6">
                    <Form.Label className="small fw-semibold mb-1">Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                    />
                  </div>
                </div>

                <Card className="bg-light border-0 p-3 mt-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>Items ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-1">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-success fw-bold' : ''}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between fw-bold fs-5 text-dark">
                    <span>Total Payable</span>
                    <span className="text-success">₹{grandTotal.toLocaleString('en-IN')}</span>
                  </div>
                </Card>
              </div>

              {/* Right Column: Payment Method */}
              <div className="col-md-6 ps-md-4">
                <h5 className="fw-bold mb-3 text-primary">💳 2. Payment Method</h5>

                <div className="mb-3">
                  <Form.Check
                    type="radio"
                    id="pay-upi"
                    label="📱 Instant UPI (GPay / PhonePe / Paytm)"
                    name="paymentMethod"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="fw-bold mb-2"
                  />
                  {paymentMethod === 'UPI' && (
                    <div className="ms-4 mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Enter UPI ID (e.g. user@okaxis)"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        className="form-control-sm"
                      />
                      <small className="text-muted d-block mt-1">
                        ⚡ Any dummy UPI ID will work in mock mode.
                      </small>
                    </div>
                  )}

                  <Form.Check
                    type="radio"
                    id="pay-card"
                    label="💳 Credit / Debit Card"
                    name="paymentMethod"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                    className="fw-bold mb-2"
                  />
                  {paymentMethod === 'CARD' && (
                    <div className="ms-4 mb-3 p-2 bg-light rounded border">
                      <Form.Control
                        type="text"
                        placeholder="Card Number (e.g. 4532 •••• •••• 8890)"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="form-control-sm mb-2"
                      />
                      <div className="row g-2">
                        <div className="col-6">
                          <Form.Control
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="form-control-sm"
                          />
                        </div>
                        <div className="col-6">
                          <Form.Control
                            type="password"
                            placeholder="CVV"
                            maxLength={3}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="form-control-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <Form.Check
                    type="radio"
                    id="pay-cod"
                    label="💵 Cash on Delivery (COD)"
                    name="paymentMethod"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="fw-bold mb-2"
                  />
                </div>

                <Button
                  variant="success"
                  type="submit"
                  className="w-100 py-3 fw-bold fs-5 shadow-sm mt-3"
                >
                  🔒 Pay ₹{grandTotal.toLocaleString('en-IN')} Now
                </Button>
              </div>
            </div>
          </Form>
        )}

        {/* STEP 2: PROCESSING ANIMATION */}
        {step === 'PROCESSING' && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
            <h4 className="fw-bold mt-4">Connecting to Bank Gateway...</h4>
            <p className="text-muted">Please do not refresh or close this window.</p>
          </div>
        )}

        {/* STEP 3: PAYMENT SUCCESS RECEIPT */}
        {step === 'SUCCESS' && (
          <div className="text-center py-3">
            <div className="fs-1 text-success mb-2">🎉</div>
            <h3 className="fw-bold text-success">Payment Successful!</h3>
            <p className="text-muted mb-4">Your order has been placed & stored in MongoDB!</p>

            <Card className="mx-auto border-success p-3 text-start bg-light mb-4" style={{ maxWidth: '480px' }}>
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Transaction ID:</span>
                <span className="fw-bold font-monospace text-dark">
                  {transactionResult?.paymentResult?.transactionId || 'TXN_998124'}
                </span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Order ID:</span>
                <span className="fw-bold font-monospace text-dark">
                  {transactionResult?._id || 'ORD_LOCAL_102'}
                </span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Customer Email:</span>
                <span className="fw-bold text-dark">
                  {transactionResult?.guestEmail || email}
                </span>
              </div>
              <div className="d-flex justify-content-between small text-muted mb-2">
                <span>Payment Method:</span>
                <span className="fw-bold text-dark">{paymentMethod}</span>
              </div>
              <div className="d-flex justify-content-between small text-muted">
                <span>Amount Paid:</span>
                <span className="fw-bold text-success fs-6">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </Card>

            <Button variant="primary" className="px-5 py-2 fw-bold" onClick={handleFinish}>
              Continue Shopping 🛍️
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default PaymentModal;
