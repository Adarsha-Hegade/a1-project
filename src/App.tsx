import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import SuperAdminSignup from './pages/SuperAdminSignup';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Users from './pages/Users';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { checkFirstUser } from './services/auth';

const queryClient = new QueryClient();

function App() {
  const [isFirstUser, setIsFirstUser] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const result = await checkFirstUser();
      setIsFirstUser(result);
    };
    checkUser();
  }, []);

  if (isFirstUser === null) {
    return null; // or a loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route 
                path="/login" 
                element={isFirstUser ? <Navigate to="/super-admin-signup" /> : <Login />} 
              />
              <Route 
                path="/super-admin-signup" 
                element={isFirstUser ? <SuperAdminSignup /> : <Navigate to="/login" />} 
              />
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/users" element={<Users />} />
              </Route>
            </Routes>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default App;