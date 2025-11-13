
import React, { useState } from 'react';
import { mockOrders, mockProducts } from '../mock/data';
import { Order, Product } from '../types';

type AdminView = 'DASHBOARD' | 'ORDERS' | 'PROCUREMENT' | 'HUBS';

const AdminView: React.FC = () => {
  const [currentView, setCurrentView] = useState<AdminView>('DASHBOARD');

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'ORDERS':
        return <OrderManagement />;
      case 'PROCUREMENT':
        return <ProcurementList />;
      case 'HUBS':
        return <HubManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-8">FrescoHub Admin</h2>
        <nav>
          <ul>
            <li className="mb-4"><button onClick={() => setCurrentView('DASHBOARD')} className="w-full text-left hover:bg-gray-700 p-2 rounded">Dashboard</button></li>
            <li className="mb-4"><button onClick={() => setCurrentView('ORDERS')} className="w-full text-left hover:bg-gray-700 p-2 rounded">Orders</button></li>
            <li className="mb-4"><button onClick={() => setCurrentView('PROCUREMENT')} className="w-full text-left hover:bg-gray-700 p-2 rounded">Procurement</button></li>
            <li><button onClick={() => setCurrentView('HUBS')} className="w-full text-left hover:bg-gray-700 p-2 rounded">Hub Management</button></li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8">
        {renderView()}
      </main>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(o => o.status === 'Pending').length;
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Orders</h3>
          <p className="text-4xl font-bold text-gray-800">{totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Pending Orders</h3>
          <p className="text-4xl font-bold text-orange-500">{pendingOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-600">Total Revenue</h3>
          <p className="text-4xl font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

const OrderManagement: React.FC = () => (
  <div>
    <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Management</h1>
    <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-4">Order ID</th>
            <th className="p-4">Date</th>
            <th className="p-4">User ID</th>
            <th className="p-4">Total</th>
            <th className="p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {mockOrders.map(order => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{order.id}</td>
              <td className="p-4">{order.date}</td>
              <td className="p-4">{order.userId}</td>
              <td className="p-4">${order.total.toFixed(2)}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const ProcurementList: React.FC = () => {
    const procurementItems = mockOrders
      .filter(order => order.status === 'Pending' || order.status === 'Processing')
      .flatMap(order => order.items)
      .reduce((acc, item) => {
        acc[item.id] = (acc[item.id] || 0) + item.quantity;
        return acc;
      }, {} as Record<string, number>);
  
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Procurement List</h1>
        <p className="mb-4 text-gray-600">Aggregated quantities needed for pending and processing orders.</p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-4">Product</th>
                <th className="p-4">Total Quantity Needed</th>
                <th className="p-4">Unit</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(procurementItems).map(([productId, quantity]) => {
                const product = mockProducts.find(p => p.id === productId);
                return (
                  <tr key={productId} className="border-b hover:bg-gray-50">
                    <td className="p-4">{product?.name || 'Unknown Product'}</td>
                    <td className="p-4 font-bold">{quantity}</td>
                    <td className="p-4">{product?.unit}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  

const HubManagement: React.FC = () => (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Hub Management</h1>
       <p className="text-gray-600">This is a placeholder for hub and farmer mapping management.</p>
    </div>
);

export default AdminView;
