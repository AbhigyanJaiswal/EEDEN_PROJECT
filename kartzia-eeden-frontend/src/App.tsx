import React from 'react'
import { CartPage } from '@components/cart/CartPage'
import { EmailAuth } from '@components/auth/EmailAuth'
import { OtpVerification } from '@components/auth/OtpVerification'
import { ProductGrid } from '@components/products/ProductGrid'
import { ErrorBoundary } from '@components/shared/errors/ErrorBoundary'
import { dummyProducts } from '@constants/products'
import { useCartStore } from '@context/cartStore'

function App() {
  const [currentPage, setCurrentPage] = React.useState<'home' | 'cart' | 'login'>('home')
  const [authStep, setAuthStep] = React.useState<'email' | 'otp'>('email')
  const [authEmail, setAuthEmail] = React.useState('')
  const [authMode, setAuthMode] = React.useState<'login' | 'signup'>('login')
  const { getItemCount } = useCartStore()

  return (
    <ErrorBoundary>
      <div className="app">
        <nav className="navbar">
          <div className="navbar-container">
            <h1 className="logo">🌿 Kartzia Eeden</h1>
            <div className="nav-links">
              <button onClick={() => setCurrentPage('home')} className="nav-button">
                Home
              </button>
              <button onClick={() => setCurrentPage('cart')} className="nav-button">
                Cart {getItemCount() > 0 && <span className="cart-count">{getItemCount()}</span>}
              </button>
              <button onClick={() => setCurrentPage('login')} className="nav-button">
                Login
              </button>
            </div>
          </div>
        </nav>

        <main className="main-content">
          {currentPage === 'home' && (
            <section className="home-page">
              <section className="hero">
                <h1>Welcome to Kartzia Eeden</h1>
                <p>Sustainable Fashion Redefined</p>
                <div className="hero-message">
                  <h2>Discover Eco-Friendly Fashion</h2>
                  <p>At Kartzia Eeden, we believe that fashion should be beautiful, ethical, and sustainable. Every piece in our collection is crafted from eco-friendly materials that respect both people and the planet.</p>
                  <ul className="values-list">
                    <li>✓ 100% Sustainable Materials</li>
                    <li>✓ Fair Trade & Ethical Production</li>
                    <li>✓ Timeless, Quality Designs</li>
                    <li>✓ Carbon-Neutral Shipping</li>
                  </ul>
                </div>
              </section>

              <ProductGrid products={dummyProducts} />

              <section className="cta-section">
                <h2>Ready to Shop Sustainably?</h2>
                <p>Browse our collection and add items to your cart. Checkout when you're ready!</p>
                <button 
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="btn-primary"
                >
                  Explore Products
                </button>
              </section>
            </section>
          )}

          {currentPage === 'cart' && (
            <CartPage onCheckout={() => alert('Checkout flow coming soon!')} />
          )}

          {currentPage === 'login' && (
            <div className="auth-container">
              {authStep === 'email' && (
                <EmailAuth
                  onEmailSubmitted={(email, mode) => {
                    setAuthEmail(email)
                    setAuthMode(mode)
                    setAuthStep('otp')
                  }}
                />
              )}

              {authStep === 'otp' && (
                <OtpVerification
                  email={authEmail}
                  mode={authMode}
                  onSuccess={() => {
                    setCurrentPage('home')
                    setAuthStep('email')
                    alert('Login successful!')
                  }}
                  onBack={() => setAuthStep('email')}
                />
              )}
            </div>
          )}
        </main>

        <footer className="footer">
          <p>&copy; 2026 Kartzia Eeden. All rights reserved.</p>
          <p>Flow, Usability & Logic by Abhigyan</p>
        </footer>
      </div>
    </ErrorBoundary>
  )
}

export default App
