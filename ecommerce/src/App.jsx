import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import ProductPage from './pages/ProductPage'
import CartPage from './pages/CartPage'
import Footer from './components/Footer'

function App() {
  const [cartItems, setCartItems] = useState([]);
  
  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map(item => 
          item.id === product.id 
            ? {...item, quantity: item.quantity + 1} 
            : item
        )
      );
    } else {
      setCartItems([...cartItems, {...product, quantity: 1}]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(
      cartItems.map(item => 
        item.id === productId 
          ? {...item, quantity} 
          : item
      )
    );
  };
  
  // Use basename to match the GitHub Pages path
  return (
    <BrowserRouter basename="/ecommerce">
      <div className="app-container">
        <Navbar cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage addToCart={addToCart} />} />
            <Route 
              path="/product/:id" 
              element={<ProductPage addToCart={addToCart} />} 
            />
            <Route 
              path="/cart" 
              element={
                <CartPage 
                  cartItems={cartItems}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
