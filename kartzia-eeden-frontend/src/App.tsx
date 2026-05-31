import { useEffect, useState } from 'react';
import { useAuthStore } from './context/authStore';
import { useCartStore } from './context/cartStore';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { AuthPage } from './pages/AuthPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrdersPage } from './pages/OrdersPage';
import { ProfilePage } from './pages/ProfilePage';

export type Page = 'home' | 'cart' | 'auth' | 'checkout' | 'orders' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  // FIX: track whether session restore has completed before rendering the full UI.
  // Without this gate, the header briefly flashes "Login / Sign Up" on refresh
  // even for authenticated users, because isAuthenticated is false until the
  // async restoreSession() resolves.
  const [sessionRestored, setSessionRestored] = useState(false);

  const { user, isAuthenticated, restoreSession } = useAuthStore();
  const { getItemCount } = useCartStore();
  const itemCount = getItemCount();

  useEffect(() => {
    restoreSession().finally(() => setSessionRestored(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const navigate = (page: Page) => {
    // Guard protected pages — redirect to auth if not logged in
    if (['checkout', 'orders', 'profile'].includes(page) && !isAuthenticated) {
      setCurrentPage('auth');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // FIX: show minimal loading state while we verify the stored token.
  // Keeps the screen blank rather than flickering between auth states.
  if (!sessionRestored) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', backgroundColor: '#f5f5f5',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{ textAlign: 'center', color: '#666' }}>
          <div style={{
            width: '36px', height: '36px', margin: '0 auto 1rem',
            border: '3px solid #ddd', borderTop: '3px solid #007bff',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ margin: 0 }}>Loading...</p>
        </div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':     return <HomePage onNavigate={navigate} />;
      case 'cart':     return <CartPage onNavigate={navigate} />;
      case 'auth':     return <AuthPage onNavigate={navigate} />;
      case 'checkout': return <CheckoutPage onNavigate={navigate} />;
      case 'orders':   return <OrdersPage onNavigate={navigate} />;
      case 'profile':  return <ProfilePage onNavigate={navigate} />;
      default:         return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <header style={{
        backgroundColor: '#2c3e50', color: 'white',
        padding: '1rem 2rem', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button
          onClick={() => navigate('home')}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', fontWeight: 'bold', cursor: 'pointer', padding: 0 }}
          aria-label="Kartzia Eeden home"
        >
          🏪 Kartzia Eeden
        </button>

        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search products..."
            onChange={() => { /* wire to search when products page exists */ }}
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', width: '220px' }}
            aria-label="Search products"
          />

          <button onClick={() => navigate('home')}
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer', textDecoration: currentPage === 'home' ? 'underline' : 'none' }}
            aria-current={currentPage === 'home' ? 'page' : undefined}>
            Home
          </button>

          {isAuthenticated ? (
            <>
              <button onClick={() => navigate('profile')}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
                aria-label="User profile">
                👤 {user?.name?.split(' ')[0]}
              </button>
              <button onClick={() => navigate('orders')}
                style={{ background: 'none', border: 'none', color: 'white', fontSize: '1rem', cursor: 'pointer' }}
                aria-label="My orders">
                📦 Orders
              </button>
            </>
          ) : (
            <button onClick={() => navigate('auth')}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
              🔐 Login / Sign Up
            </button>
          )}

          <button onClick={() => navigate('cart')}
            style={{ position: 'relative', background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            aria-label={`Shopping cart with ${itemCount} item${itemCount !== 1 ? 's' : ''}`}
            aria-current={currentPage === 'cart' ? 'page' : undefined}>
            🛒
            {itemCount > 0 && (
              <span aria-hidden="true" style={{
                position: 'absolute', top: '-8px', right: '-8px',
                backgroundColor: '#e74c3c', color: 'white', borderRadius: '50%',
                width: '22px', height: '22px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '0.7rem', fontWeight: 'bold',
              }}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
        </nav>
      </header>

      <main id="main-content">{renderPage()}</main>

      <footer style={{ backgroundColor: '#2c3e50', color: 'white', textAlign: 'center', padding: '2rem', marginTop: '3rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div>
              <h4>About Us</h4>
              <p style={{ fontSize: '0.9rem', color: '#bdc3c7' }}>Kartzia Eeden — premium products for the modern lifestyle.</p>
            </div>
            <div>
              <h4>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[{ label: 'Home', page: 'home' as Page }, { label: 'Cart', page: 'cart' as Page }].map(({ label, page }) => (
                  <li key={page}>
                    <button onClick={() => navigate(page)} style={{ background: 'none', border: 'none', color: '#bdc3c7', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontSize: '0.9rem' }}>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <p style={{ fontSize: '0.9rem', color: '#bdc3c7' }}>
                Email: <a href="mailto:info@kartzias.com" style={{ color: '#bdc3c7' }}>info@kartzias.com</a><br />
                Phone: <a href="tel:+18005278942" style={{ color: '#bdc3c7' }}>1-800-KARTZIA</a>
              </p>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px solid #34495e', margin: '0 0 1rem' }} />
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#95a5a6' }}>
            &copy; {new Date().getFullYear()} Kartzia Eeden. All rights reserved.
          </p>
        </div>
      </footer>

      <div id="aria-announcer" aria-live="polite" aria-atomic="true"
        style={{ position: 'absolute', left: '-10000px', width: '1px', height: '1px', overflow: 'hidden' }} />
    </div>
  );
}

export default App;
