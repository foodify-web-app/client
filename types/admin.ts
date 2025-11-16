export interface Restaurant {
  id: string;
  name: string;
  owner: string;
  status: 'approved' | 'pending' | 'rejected';
  createdDate: string;
  revenue: number;
  orders: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  restaurantId?: string;
  restaurantName?: string;
  items: OrderItem[];
  amount: number;
  status: 'pending' | 'preparing' | 'out-for-delivery' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Dish {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
  isVeg: boolean;
  isFeatured: boolean;
  availability: boolean;
  rating: number;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  joinedDate: string;
  orders: number;
  status: 'active' | 'blocked';
  totalSpent: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percentage' | 'flat';
  value: number;
  minAmount: number;
  applicableTo: 'global' | 'restaurant';
  active: boolean;
}
