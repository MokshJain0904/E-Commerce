import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import logo from '../assets/main_logo.png'
function ColorSchemesExample() {
  return (
    <>
            <Navbar bg="light" data-bs-theme="light">
        <Container>
          <div className='logo'>
          <img src={logo} alt="SwiftCart" />
          <Navbar.Brand href="/">SwiftCart</Navbar.Brand>
          </div>
          <Nav className="me-auto">
            <Nav.Link href="/">For You</Nav.Link>
            <Nav.Link href="./Electronic.js">Electronics</Nav.Link>
            <Nav.Link href="./Fashion.js">Fashion</Nav.Link>
            <Nav.Link href="./grocery.js">Grocery</Nav.Link>
            <Nav.Link href="./Education.js">Education</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default ColorSchemesExample;