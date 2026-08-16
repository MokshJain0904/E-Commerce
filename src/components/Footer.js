import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../assets/main_logo.png';

function Footer() {
  return (
    <footer className="bg-dark text-light pt-5 pb-4 mt-5 border-top border-secondary">
      <Container>
        <Row className="g-4 mb-4">
          {/* Brand Column */}
          <Col lg={4} md={6}>
            <div className="d-flex align-items-center mb-3">
              <img src={logo} alt="SwiftCart" style={{ height: '38px' }} className="me-2 rounded" />
              <span className="fs-3 fw-bold text-white">SwiftCart</span>
            </div>
            <p className="text-secondary small pe-lg-3">
              SwiftCart is your trusted online marketplace offering top Electronics, Fashion wear, Organic Groceries, and Educational resources across India.
            </p>
          </Col>

          {/* Customer Support Column */}
          <Col lg={4} md={6}>
            <h6 className="fw-bold text-white mb-3 text-uppercase tracking-wider">Customer Support</h6>
            <ul className="list-unstyled text-secondary small">
              <li className="mb-2">📍 Mumbai, India</li>
              <li className="mb-2">📞 +91 98765 43210</li>
              <li className="mb-2">✉️ support@swiftcart.in</li>
              <li className="mb-2">🚚 Track Your Order</li>
            </ul>
          </Col>

          {/* Newsletter Column */}
          <Col lg={4} md={6}>
            <h6 className="fw-bold text-white mb-3 text-uppercase tracking-wider">Newsletter</h6>
            <p className="text-secondary small mb-3">Subscribe to receive exclusive deals and discounts directly to your inbox!</p>
            <div className="input-group input-group-sm mb-2">
              <input type="email" className="form-control" placeholder="Enter your email" />
              <button className="btn btn-warning fw-bold" type="button">Subscribe</button>
            </div>
            <small className="text-muted">We respect your privacy. No spam.</small>
          </Col>
        </Row>

        <hr className="border-secondary my-3" />

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-secondary small">
          <div>&copy; {new Date().getFullYear()} SwiftCart E-Commerce. All rights reserved.</div>
          <div className="mt-2 mt-sm-0">
            <span className="me-3">Privacy Policy</span>
            <span className="me-3">Terms of Service</span>
            <span>Made in India 🇮🇳</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
