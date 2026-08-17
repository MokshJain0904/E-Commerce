import React, { useState, useEffect } from 'react';
import './App.css';
import ColorSchemesExample from './components/navbar';
import IndividualIntervalsExample from './components/slide-show';
import ElectronicSection from './components/Electronic';
import FashionSection from './components/Fashion';
import GrocerySection from './components/grocery';
import EducationSection from './components/Education';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import OrdersModal from './components/OrdersModal';
import Footer from './components/Footer';
import { products as initialProducts } from './data/productData';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import API_BASE_URL from './config/apiConfig';

function App() {
  // State for product list (initialized with all 32 products)
  const [productList, setProductList] = useState(initialProducts);

  // State for cart items
  const [cart, setCart] = useState([]);
  // State for active category tab ('All', 'Electronics', 'Fashion', 'Grocery', 'Education')
  const [activeCategory, setActiveCategory] = useState('All');
  // State for search filter
  const [searchQuery, setSearchQuery] = useState('');

  // State for Modals
  const [showCartModal, setShowCartModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);

  // State for Authenticated User
  const [user, setUser] = useState(null);

  // State for Toast feedback
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // 1. Fetch Products dynamically from Express / MongoDB API
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProductList(data);
        }
      })
      .catch((err) => {
        console.log('Using local fallback product data:', err.message);
        setProductList(initialProducts);
      });
  }, []);

  // 2. Load stored user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('swiftcart_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Add product to cart handler
  const handleAddToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    setToastMessage(`Added "${product.name}" to your cart!`);
    setShowToast(true);
  };

  // Update item quantity in cart
  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))
    );
  };

  // Remove item from cart
  const handleRemoveItem = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  // User Logout
  const handleLogout = () => {
    localStorage.removeItem('swiftcart_user');
    setUser(null);
    setToastMessage('Logged out successfully');
    setShowToast(true);
  };

  // Payment Completed Handler
  const handlePaymentComplete = () => {
    setCart([]);
    setShowCartModal(false);
    setToastMessage('🎉 Payment successful! Order saved in MongoDB.');
    setShowToast(true);
  };

  // Calculate total items count in cart
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Filter products based on search query and active category
  const filteredProducts = productList.filter((p) => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="App d-flex flex-column min-vh-100 bg-light">
      {/* 1. Navigation Bar */}
      <ColorSchemesExample
        activeCategory={activeCategory}
        onSelectCategory={(category) => {
          setActiveCategory(category);
          setSearchQuery(''); // clear search on category change
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        onOpenCart={() => setShowCartModal(true)}
        user={user}
        onOpenAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onOpenOrders={() => setShowOrdersModal(true)}
      />

      {/* 2. Trending Slideshow (Shown on Home / "All" view when not searching) */}
      {activeCategory === 'All' && searchQuery === '' && (
        <IndividualIntervalsExample />
      )}

      {/* 3. Main Content / Product Sections */}
      <main className="flex-grow-1">
        {searchQuery !== '' ? (
          /* Search Results View */
          <Container className="my-4">
            <h3 className="fw-bold mb-3">
              Search Results for <span className="text-primary">"{searchQuery}"</span>
            </h3>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <h4>No products found matching your search.</h4>
                <p>Try searching for headphones, sneakers, coffee, or books.</p>
              </div>
            ) : (
              <Row className="g-4">
                {filteredProducts.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={product} onAddToCart={handleAddToCart} />
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        ) : activeCategory === 'All' ? (
          /* "All" / Home View with Category Blocks */
          <>
            <ElectronicSection products={productList} onAddToCart={handleAddToCart} />
            <FashionSection products={productList} onAddToCart={handleAddToCart} />
            <GrocerySection products={productList} onAddToCart={handleAddToCart} />
            <EducationSection products={productList} onAddToCart={handleAddToCart} />
          </>
        ) : activeCategory === 'Electronics' ? (
          <ElectronicSection products={productList} onAddToCart={handleAddToCart} />
        ) : activeCategory === 'Fashion' ? (
          <FashionSection products={productList} onAddToCart={handleAddToCart} />
        ) : activeCategory === 'Grocery' ? (
          <GrocerySection products={productList} onAddToCart={handleAddToCart} />
        ) : activeCategory === 'Education' ? (
          <EducationSection products={productList} onAddToCart={handleAddToCart} />
        ) : null}
      </main>

      {/* 4. Notification Toast when adding items or completing actions */}
      <ToastContainer position="bottom-end" className="p-3 style-toast" style={{ zIndex: 9999 }}>
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">🛒 SwiftCart</strong>
            <small>Just now</small>
          </Toast.Header>
          <Toast.Body className="text-white fw-bold">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* 5. Modals */}
      {/* Cart Drawer Modal */}
      <CartModal
        show={showCartModal}
        onHide={() => setShowCartModal(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToPayment={() => {
          setShowCartModal(false);
          setShowPaymentModal(true);
        }}
      />

      {/* User Auth Modal */}
      <AuthModal
        show={showAuthModal}
        onHide={() => setShowAuthModal(false)}
        onLoginSuccess={(loggedInUser) => {
          setUser(loggedInUser);
          setToastMessage(`Welcome back, ${loggedInUser.name}!`);
          setShowToast(true);
        }}
      />

      {/* Mock Payment Gateway Modal */}
      <PaymentModal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        cart={cart}
        user={user}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* My Orders History Modal */}
      <OrdersModal
        show={showOrdersModal}
        onHide={() => setShowOrdersModal(false)}
        user={user}
      />

      {/* 6. Footer */}
      <Footer />
    </div>
  );
}

export default App;
