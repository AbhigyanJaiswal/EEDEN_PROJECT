import React, { useEffect, useState } from 'react';
import { orderApi } from '@utils/api/endpoints';
import { LoadingState } from '@components/shared/errors/LoadingState';
import { ErrorState } from '@components/shared/errors/ErrorState';

interface Order {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  items: Array<{ name: string; quantity: number; price: number }>;
}

export const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const response = await orderApi.getOrders();
      if (response.success && response.data) {
        setOrders((response.data as any).orders || []);
      } else {
        setError(response.error?.message || 'Failed to load orders');
      }
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  if (isLoading) {
    return <LoadingState message="Loading your orders..." />;
  }

  if (error) {
    return <ErrorState message={error} retry={() => window.location.reload()} />;
  }

  if (orders.length === 0) {
    return (
      <div className="empty-orders">
        <h2>No orders yet</h2>
        <p>You haven't placed any orders yet. Start shopping!</p>
      </div>
    );
  }

  return (
    <div className="order-history">
      <h1>Order History</h1>
      <div className="orders-list" role="region" aria-label="Your orders">
        {orders.map((order) => (
          <div key={order.id} className="order-card" role="article">
            <div className="order-header">
              <div className="order-id">Order #{order.id}</div>
              <div className={`order-status status-${order.status}`}>{order.status}</div>
            </div>
            <div className="order-date">{new Date(order.createdAt).toLocaleDateString()}</div>
            <div className="order-items">
              {order.items.map((item, idx) => (
                <div key={idx} className="item">
                  {item.name} x{item.quantity}
                </div>
              ))}
            </div>
            <div className="order-total">${order.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
