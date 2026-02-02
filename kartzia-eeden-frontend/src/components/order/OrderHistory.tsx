import React, { useEffect, useState } from 'react';
import { LoadingState } from '../shared/errors/LoadingState';
import { ErrorState } from '../shared/errors/ErrorState';
import { EmptyState } from '../shared/errors/EmptyState';

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
}

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/orders', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken') || ''}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data.orders || []);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch orders';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading your orders..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No Orders Yet"
        message="You haven't placed any orders yet. Start shopping now!"
        action={{
          label: 'Start Shopping',
          onClick: () => (window.location.href = '/'),
        }}
      />
    );
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '1rem',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid #ddd' }}>
            <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 'bold' }}>Order ID</th>
            <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>Date</th>
            <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>Items</th>
            <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 'bold' }}>Total</th>
            <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 'bold' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} style={{ borderBottom: '1px solid #eee' }}>
              <td style={{ padding: '1rem' }}>
                <a href={`/orders/${order.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>
                  {order.id}
                </a>
              </td>
              <td style={{ textAlign: 'center', padding: '1rem' }}>
                {new Date(order.date).toLocaleDateString()}
              </td>
              <td style={{ textAlign: 'center', padding: '1rem' }}>{order.items}</td>
              <td style={{ textAlign: 'right', padding: '1rem', fontWeight: 'bold' }}>
                ${order.total.toFixed(2)}
              </td>
              <td style={{ textAlign: 'center', padding: '1rem' }}>
                <span
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '4px',
                    backgroundColor: order.status === 'delivered' ? '#d4edda' : '#fff3cd',
                    color: order.status === 'delivered' ? '#155724' : '#856404',
                    fontSize: '0.875rem',
                    fontWeight: 'bold',
                  }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
