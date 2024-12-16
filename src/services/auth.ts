import axios from 'axios';
import { AuthResponse } from '../types';

const API_URL = 'http://localhost:5000/api';

export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const registerUser = async (userData: {
  username: string;
  email: string;
  password: string;
  role?: string;
  permissions?: string[];
}): Promise<AuthResponse> => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const checkFirstUser = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${API_URL}/auth/check-first-user`);
    return response.data.isFirstUser;
  } catch (error) {
    return false;
  }
};