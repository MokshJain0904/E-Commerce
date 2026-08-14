import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import logo from '../assets/main_logo.png';

function ColorSchemesExample({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart
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

          {/* Search Input & Cart Button */}
          <div className="d-flex align-items-center gap-3">
            <Form className="d-flex" onSubmit={(e) => e.preventDefault()}>
              <Form.Control
                type="search"
                placeholder="Search products..."
                className="me-2 rounded-pill bg-light"
                value={searchQuery}
                aria-label="Search"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </Form>

            <Button
              variant="warning"
              className="d-flex align-items-center gap-2 rounded-pill fw-bold"
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