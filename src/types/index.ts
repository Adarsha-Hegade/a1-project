export interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  permissions: string[];
}

export interface Product {
  _id: string;
  image: string;
  name?: string;
  productCode: string;
  size: string;
  manufacturer: string;
  stock: number;
  badStock: number;
  bookings: number;
  availableStock: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
}