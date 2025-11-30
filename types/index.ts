export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  cuisineTypes: string[];
  isOpen: boolean;
  offers?: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  restaurantId: string;
  category: string;
  isVegetarian: boolean;
}

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  restaurantId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface UserRes { 
  token: string, 
  userId: string, 
  success: string, 
  role: string 
}
export interface DishRes { 
  _id: string, 
  name: string, 
  description: string, 
  price: number,
  image: string,
  category: string,
  rating : string,
  restaurantId: string
}

export interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  status: 'placed' | 'preparing' | 'out-for-delivery' | 'delivered';
  totalAmount: number;
  deliveryAddress: Address;
  paymentMethod: string;
  createdAt: Date;
  estimatedDelivery: Date;
}
