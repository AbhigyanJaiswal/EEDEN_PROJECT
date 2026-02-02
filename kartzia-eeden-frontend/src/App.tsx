import { useEffect } from 'react';
import { useAuthStore } from './context/authStore';
import { useCartStore } from './context/cartStore';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token && !user) {
        // Verify token and fetch user data
        // This would typically be done with an API call
      }
    };

    checkAuth();
  }, [user]);

  return (
    <div className="app" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#333',
          color: 'white',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Kartzia Eeden</h1>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/" style={{ color: 'white', textDecoration: 'none' }}>
            Home
          </a>
          {isAuthenticated ? (
            <>
              <a href="/profile" style={{ color: 'white', textDecoration: 'none' }}>
                Profile
              </a>
              <a href="/orders" style={{ color: 'white', textDecoration: 'none' }}>
                Orders
              </a>
              <button
                onClick={() => {
                  useAuthStore.getState().logout();
                  window.location.href = '/';
                }}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" style={{ color: 'white', textDecoration: 'none' }}>
                Login
              </a>
              <a href="/signup" style={{ color: 'white', textDecoration: 'none' }}>
                Signup
              </a>
            </>
          )}
          <a
            href="/cart"
            style={{
              color: 'white',
              textDecoration: 'none',
              position: 'relative',
            }}
            aria-label={`Shopping cart with ${items.length} items`}
          >
            🛒 ({items.length})
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <section
          id="main-content"
          style={{
            backgroundColor: 'white',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h2>Welcome to Kartzia Eeden</h2>
          <p>
            This is your e-commerce platform. Browse our products, add them to your cart, and checkout with ease.
          </p>
          {isAuthenticated && (
            <p style={{ color: '#28a745', fontWeight: 'bold' }}>
              Welcome back, {user?.name}!
            </p>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#333',
          color: 'white',
          textAlign: 'center',
          padding: '1rem',
          marginTop: '2rem',
        }}
      >
        <p style={{ margin: 0 }}>
          &copy; 2024 Kartzia Eeden. All rights reserved.
        </p>
      </footer>

      {/* Accessibility Announcer */}
      <div
        id="aria-announcer"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
}

export default App;
