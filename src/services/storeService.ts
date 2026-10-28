import { db } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  runTransaction,
  Timestamp,
} from 'firebase/firestore';
import {
  Product,
  Category,
  Order,
  Customer,
  StoreSettings,
  OrderStatus,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  DEFAULT_STORE_SETTINGS,
} from '@/lib/initialData';

const PRODUCTS_COLLECTION = 'products';
const CATEGORIES_COLLECTION = 'categories';
const ORDERS_COLLECTION = 'orders';
const CUSTOMERS_COLLECTION = 'customers';
const SETTINGS_COLLECTION = 'settings';
const SETTINGS_DOC_ID = 'store_config';

// --- PRODUCTS ---
export async function getProducts(onlyPublished = false): Promise<Product[]> {
  // During SSR / static build or if window is undefined, quickly return initial catalogue
  if (typeof window === 'undefined') {
    return onlyPublished
      ? INITIAL_PRODUCTS.filter((p) => p.isPublished)
      : INITIAL_PRODUCTS;
  }

  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    const q = onlyPublished
      ? query(colRef, where('isPublished', '==', true))
      : colRef;
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return onlyPublished
        ? INITIAL_PRODUCTS.filter((p) => p.isPublished)
        : INITIAL_PRODUCTS;
    }

    const products: Product[] = [];
    snapshot.forEach((doc) => {
      products.push({ id: doc.id, ...(doc.data() as Omit<Product, 'id'>) });
    });
    return products;
  } catch (error) {
    console.warn('Firestore fetch fallback to initial dataset:', error);
    return onlyPublished
      ? INITIAL_PRODUCTS.filter((p) => p.isPublished)
      : INITIAL_PRODUCTS;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  if (typeof window === 'undefined') {
    const found = INITIAL_PRODUCTS.find((p) => p.id === id);
    return found || null;
  }
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...(snapshot.data() as Omit<Product, 'id'>) };
    }
    const found = INITIAL_PRODUCTS.find((p) => p.id === id);
    return found || null;
  } catch (error) {
    console.warn('Firestore getProductById fallback:', error);
    const found = INITIAL_PRODUCTS.find((p) => p.id === id);
    return found || null;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
  const data = {
    ...product,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(docRef, data, { merge: true });
}

export async function deleteProduct(id: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, id);
  await deleteDoc(docRef);
}

// --- CATEGORIES ---
export async function getCategories(): Promise<Category[]> {
  if (typeof window === 'undefined') {
    return INITIAL_CATEGORIES;
  }
  try {
    const colRef = collection(db, CATEGORIES_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      return INITIAL_CATEGORIES;
    }
    const categories: Category[] = [];
    snapshot.forEach((doc) => {
      categories.push({ id: doc.id, ...(doc.data() as Omit<Category, 'id'>) });
    });
    return categories;
  } catch (error) {
    console.warn('Categories fallback:', error);
    return INITIAL_CATEGORIES;
  }
}

export async function saveCategory(category: Category): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, category.id);
  await setDoc(docRef, category, { merge: true });
}

export async function deleteCategory(id: string): Promise<void> {
  const docRef = doc(db, CATEGORIES_COLLECTION, id);
  await deleteDoc(docRef);
}

// --- ORDERS ---
export async function createOrder(order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'statusHistory'>): Promise<Order> {
  const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    ...order,
    id: orderId,
    orderNumber: orderId,
    status: 'Pending',
    createdAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: 'Pending',
        timestamp: now,
        note: 'Order placed by customer via Cash on Delivery (COD)',
      },
    ],
  };

  try {
    // 1. Save order to Firestore
    const orderDocRef = doc(db, ORDERS_COLLECTION, orderId);
    await setDoc(orderDocRef, newOrder);

    // 2. Decrement product stock in Firestore
    for (const item of newOrder.items) {
      try {
        const prodRef = doc(db, PRODUCTS_COLLECTION, item.productId);
        const prodSnap = await getDoc(prodRef);
        if (prodSnap.exists()) {
          const currentStock = prodSnap.data().stockQuantity ?? 10;
          const newStock = Math.max(0, currentStock - item.quantity);
          await updateDoc(prodRef, { stockQuantity: newStock });
        }
      } catch (err) {
        console.warn('Could not update stock for item', item.productId, err);
      }
    }

    // 3. Upsert customer record
    const customerPhone = newOrder.customer.phone.replace(/\s+/g, '');
    const customerDocRef = doc(db, CUSTOMERS_COLLECTION, customerPhone);
    const customerSnap = await getDoc(customerDocRef);

    if (customerSnap.exists()) {
      const existing = customerSnap.data() as Customer;
      await updateDoc(customerDocRef, {
        totalOrders: (existing.totalOrders || 1) + 1,
        totalSpent: (existing.totalSpent || 0) + newOrder.total,
        lastOrderDate: now,
        isRepeatCustomer: true,
        address: newOrder.customer.address,
        district: newOrder.customer.district,
      });
    } else {
      const newCustomer: Customer = {
        id: customerPhone,
        name: newOrder.customer.name,
        phone: newOrder.customer.phone,
        email: newOrder.customer.email,
        address: newOrder.customer.address,
        district: newOrder.customer.district,
        totalOrders: 1,
        totalSpent: newOrder.total,
        lastOrderDate: now,
        isRepeatCustomer: false,
      };
      await setDoc(customerDocRef, newCustomer);
    }
  } catch (error) {
    console.error('Error in createOrder Firestore write:', error);
    // If offline or blocked, save locally in localStorage so checkout never crashes
    if (typeof window !== 'undefined') {
      const existingOrders: Order[] = JSON.parse(localStorage.getItem('lola_local_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('lola_local_orders', JSON.stringify(existingOrders));
    }
  }

  return newOrder;
}

export async function getOrders(): Promise<Order[]> {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    const q = query(colRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const orders: Order[] = [];
    snapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...(doc.data() as Omit<Order, 'id'>) });
    });

    // Merge with any local orders if present
    if (typeof window !== 'undefined') {
      const localOrders: Order[] = JSON.parse(localStorage.getItem('lola_local_orders') || '[]');
      const combined = [...orders];
      for (const lo of localOrders) {
        if (!combined.some((o) => o.id === lo.id)) {
          combined.push(lo);
        }
      }
      return combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return orders;
  } catch (error) {
    console.warn('Orders fetch fallback:', error);
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('lola_local_orders') || '[]');
    }
    return [];
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  note?: string,
  cancellationReason?: string
): Promise<void> {
  const now = new Date().toISOString();
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const existing = snap.data() as Order;
      const history = existing.statusHistory || [];
      history.push({
        status: newStatus,
        timestamp: now,
        note: note || `Status updated to ${newStatus}`,
      });

      const updatePayload: Partial<Order> = {
        status: newStatus,
        updatedAt: now,
        statusHistory: history,
      };

      if (cancellationReason) {
        updatePayload.cancellationReason = cancellationReason;
      }
      if (newStatus === 'Delivered') {
        updatePayload.paymentStatus = 'Paid';
      }

      await updateDoc(docRef, updatePayload);
    }
  } catch (error) {
    console.error('Error updating order status in Firestore:', error);
  }

  // Also update local storage if present
  if (typeof window !== 'undefined') {
    const localOrders: Order[] = JSON.parse(localStorage.getItem('lola_local_orders') || '[]');
    const updated = localOrders.map((o) => {
      if (o.id === orderId) {
        const history = o.statusHistory || [];
        history.push({
          status: newStatus,
          timestamp: now,
          note: note || `Status updated to ${newStatus}`,
        });
        return {
          ...o,
          status: newStatus,
          updatedAt: now,
          statusHistory: history,
          cancellationReason: cancellationReason || o.cancellationReason,
          paymentStatus: (newStatus === 'Delivered' ? 'Paid' : o.paymentStatus) as 'Pending' | 'Paid',
        };
      }
      return o;
    });
    localStorage.setItem('lola_local_orders', JSON.stringify(updated));
  }
}

// --- CUSTOMERS ---
export async function getCustomers(): Promise<Customer[]> {
  try {
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    const snapshot = await getDocs(colRef);
    const list: Customer[] = [];
    snapshot.forEach((doc) => {
      list.push({ id: doc.id, ...(doc.data() as Omit<Customer, 'id'>) });
    });
    return list;
  } catch (error) {
    console.warn('Customers fetch fallback:', error);
    return [];
  }
}

// --- SETTINGS ---
export async function getStoreSettings(): Promise<StoreSettings> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as StoreSettings;
    }
    return DEFAULT_STORE_SETTINGS;
  } catch (error) {
    console.warn('Store settings fallback:', error);
    return DEFAULT_STORE_SETTINGS;
  }
}

export async function saveStoreSettings(settings: StoreSettings): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID);
  await setDoc(docRef, settings, { merge: true });
}

// --- SEED DATABASE UTILITY ---
export async function seedDatabase(): Promise<{ success: boolean; message: string }> {
  try {
    // 1. Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, CATEGORIES_COLLECTION, cat.id), cat, { merge: true });
    }

    // 2. Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod, { merge: true });
    }

    // 3. Seed Settings
    await setDoc(doc(db, SETTINGS_COLLECTION, SETTINGS_DOC_ID), DEFAULT_STORE_SETTINGS, { merge: true });

    return {
      success: true,
      message: `Successfully seeded ${INITIAL_CATEGORIES.length} categories, ${INITIAL_PRODUCTS.length} products, and store settings into Firebase!`,
    };
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: error?.message || 'Failed to seed database to Firestore.',
    };
  }
}
