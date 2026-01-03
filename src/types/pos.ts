export interface Product {
  id: string;
  name: string;
  price: number;
  cost: number; // Себестоимость
  category: string;
  image?: string;
  stock: number;
  barcode?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Sale {
  id: string;
  items: CartItem[];
  total: number;
  paymentMethod: 'cash' | 'card';
  timestamp: Date;
  cashReceived?: number;
  change?: number;
}

export interface DailySummary {
  date: string;
  totalSales: number;
  transactionCount: number;
  topProducts: { name: string; quantity: number }[];
}
