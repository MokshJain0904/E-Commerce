import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Nav from 'react-bootstrap/Nav';

function AuthModal({ show, onHide, onLoginSuccess }) {
  const [activeTab, setActiveTab] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint =
      activeTab === 'login'
        ? 'http://localhost:5000/api/users/login'
        : 'http://localhost:5000/api/users/register';

    const payload =
      activeTab === 'login'
        ? { email, password }
        : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      // Store in localStorage for persistence
      localStorage.setItem('swiftcart_user', JSON.stringify(data));
      onLoginSuccess(data);
      handleClose();
    } catch (err) {
      setError(err.message || 'Server connection issue. Try demo account (user@example.com / password123)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="auth-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold fs-4 text-primary">
          👤 {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 py-3">
        {/* Navigation Tabs */}
        <Nav
          variant="pills"
          activeKey={activeTab}
          onSelect={(k) => {
            setActiveTab(k);
            setError('');
          }}
          className="nav-justified mb-3 bg-light p-1 rounded-3"
        >
          <Nav.Item>
            <Nav.Link eventKey="login" className="fw-semibold">
              🔑 Login
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="register" className="fw-semibold">
              📝 Register
            </Nav.Link>
          </Nav.Item>
        </Nav>

        {error && <Alert variant="danger" className="py-2 small">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {activeTab === 'register' && (
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold small">Full Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="e.g. user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold small">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          {activeTab === 'login' && (
            <div className="bg-light p-2 rounded mb-3 text-muted small">
              💡 <strong>Demo Credentials:</strong><br />
              Email: <code>user@example.com</code> | Password: <code>password123</code>
            </div>
          )}

          <Button
            variant="primary"
            type="submit"
            className="w-100 py-2 fw-bold shadow-sm"
            disabled={loading}
          >
            {loading
              ? 'Processing...'
              : activeTab === 'login'
              ? 'Sign In'
              : 'Create My Account'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AuthModal;
