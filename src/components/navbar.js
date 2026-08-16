import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import Dropdown from 'react-bootstrap/Dropdown';
import logo from '../assets/main_logo.png';

function ColorSchemesExample({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  user,
  onOpenAuth,
  onLogout,
  onOpenOrders
}) {
  const categories = [
    { key: 'All', label: 'For You' },
    { key: 'Electronics', label: 'Electronics' },
    { key: 'Fashion', label: 'Fashion' },
    { key: 'Grocery', label: 'Grocery' },
    { key: 'Education', label: 'Education' }
  ];

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-sm">
      <Container>
        {/* Brand Logo & Name */}
        <Navbar.Brand
          href="#home"
          onClick={(e) => { e.preventDefault(); onSelectCategory('All'); }}
          className="d-flex align-items-center cursor-pointer"
        >
          <img
            src={logo}
            alt="SwiftCart"
            style={{ height: '36px', width: 'auto' }}
            className="me-2 rounded"
          />
          <span className="fw-bold text-white fs-4">SwiftCart</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Category Navigation Links */}
          <Nav className="me-auto my-2 my-lg-0">
            {categories.map((cat) => (
              <Nav.Link
                key={cat.key}
                active={activeCategory === cat.key}
                onClick={() => onSelectCategory(cat.key)}
                className={`px-3 ${activeCategory === cat.key ? 'fw-bold text-warning border-bottom border-warning border-2' : ''}`}
              >
                {cat.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* Search Input, My Orders, Auth & Cart Button */}
          <div className="d-flex align-items-center gap-2">
            <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="search"
                placeholder="Search products..."
                className="rounded-pill bg-light"
                value={searchQuery}
                aria-label="Search"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </Form>

            {/* My Orders Button */}
            <Button
              variant="outline-info"
              className="rounded-pill px-3 fw-semibold text-white border-secondary"
              onClick={onOpenOrders}
            >
              📦 My Orders
            </Button>

            {/* Auth Button / User Dropdown */}
            {user ? (
              <Dropdown align="end">
                <Dropdown.Toggle variant="outline-light" id="dropdown-user" className="rounded-pill fw-semibold border-0 bg-secondary bg-opacity-25">
                  👤 {user.name.split(' ')[0]}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item header className="text-muted small">
                    Signed in as <strong>{user.email}</strong>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={onOpenOrders}>
                    📦 My Orders & Status
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={onLogout} className="text-danger">
                    🚪 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                variant="outline-light"
                className="rounded-pill px-3 fw-semibold"
                onClick={onOpenAuth}
              >
                👤 Login
              </Button>
            )}

            <Button
              variant="warning"
              className="d-flex align-items-center gap-2 rounded-pill fw-bold ms-1"
              onClick={onOpenCart}
            >
              <span>🛒 Cart</span>
              <Badge bg="dark" text="light" pill>
                {cartCount}
              </Badge>
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ColorSchemesExample;