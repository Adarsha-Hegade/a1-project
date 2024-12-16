import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Product } from '../types';

const Dashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/products/stats');
      return response.data;
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          description="Total number of products"
        />
        <DashboardCard
          title="Low Stock"
          value={stats?.lowStock || 0}
          description="Products with low stock"
        />
        <DashboardCard
          title="Out of Stock"
          value={stats?.outOfStock || 0}
          description="Products out of stock"
        />
        <DashboardCard
          title="Total Value"
          value={`$${stats?.totalValue?.toFixed(2) || '0.00'}`}
          description="Total inventory value"
        />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  value: number | string;
  description: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, description }) => {
  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
              {title}
            </p>
            <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
              {value}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default Dashboard;