// Analytics & Tracking for Lola Studio
// Meta (Facebook) Pixel & TikTok Pixel Integration

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
    ttq?: any;
  }
}

export const trackPageView = (url?: string) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'PageView');
  }

  // TikTok Pixel
  if (window.ttq) {
    window.ttq.page();
  }
};

export const trackViewContent = (product: {
  id: string;
  name: string;
  price: number;
  categoryName?: string;
}) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'ViewContent', {
      content_ids: [product.id],
      content_name: product.name,
      content_category: product.categoryName || 'Decor',
      value: product.price,
      currency: 'LKR',
    });
  }

  // TikTok Pixel
  if (window.ttq) {
    window.ttq.track('ViewContent', {
      content_id: product.id,
      content_name: product.name,
      content_type: 'product',
      value: product.price,
      currency: 'LKR',
    });
  }
};

export const trackAddToCart = (product: {
  id: string;
  name: string;
  price: number;
  quantity: number;
}) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_ids: [product.id],
      content_name: product.name,
      value: product.price * product.quantity,
      currency: 'LKR',
    });
  }

  // TikTok Pixel
  if (window.ttq) {
    window.ttq.track('AddToCart', {
      content_id: product.id,
      content_name: product.name,
      quantity: product.quantity,
      value: product.price * product.quantity,
      currency: 'LKR',
    });
  }
};

export const trackInitiateCheckout = (total: number, itemsCount: number) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'InitiateCheckout', {
      value: total,
      currency: 'LKR',
      num_items: itemsCount,
    });
  }

  // TikTok Pixel
  if (window.ttq) {
    window.ttq.track('InitiateCheckout', {
      value: total,
      currency: 'LKR',
      quantity: itemsCount,
    });
  }
};

export const trackPurchase = (order: {
  id: string;
  total: number;
  items: Array<{ productId: string; name: string; price: number; quantity: number }>;
}) => {
  if (typeof window === 'undefined') return;

  // Meta Pixel
  if (window.fbq) {
    window.fbq('track', 'Purchase', {
      content_ids: order.items.map(i => i.productId),
      content_type: 'product',
      value: order.total,
      currency: 'LKR',
      order_id: order.id,
    });
  }

  // TikTok Pixel
  if (window.ttq) {
    window.ttq.track('CompletePayment', {
      content_id: order.id,
      value: order.total,
      currency: 'LKR',
      quantity: order.items.reduce((acc, curr) => acc + curr.quantity, 0),
    });
  }
};
