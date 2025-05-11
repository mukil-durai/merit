export const getStatusDetails = (status) => {
  switch (status) {
    case 'Pending':
      return { bg: 'danger', icon: '⌛', text: 'Pending', description: 'Order is being processed' };
    case 'Confirmed':
      return { bg: 'warning', icon: '✓', text: 'Confirmed', description: 'Order confirmed' };
    case 'Shipped':
      return { bg: 'info', icon: '🚚', text: 'Shipped', description: 'On the way' };
    case 'Delivered':
      return { bg: 'success', icon: '📦', text: 'Delivered', description: 'Order delivered' };
    default:
      return { bg: 'secondary', icon: '?', text: 'Unknown', description: 'Status unknown' };
  }
};

export const calculateOrderStatus = (orderDate) => {
  const now = new Date();
  const orderDateTime = new Date(orderDate);
  const minutesDiff = Math.floor((now - orderDateTime) / (1000 * 60));

  // More granular status progression
  if (minutesDiff < 1440) return 'Pending';        // First 24 hours (1440 minutes)
  if (minutesDiff < 2880) return 'Confirmed';      // 24-48 hours
  if (minutesDiff < 7200) return 'Shipped';        // 48-120 hours (2-5 days)
  return 'Delivered';                              // After 5 days
};
