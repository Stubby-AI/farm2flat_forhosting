import React, { useState, useEffect } from 'react';
import { mockOrders, mockProducts, mockFarmers, mockHubs, mockHubFarmerMap } from '../mock/data';
import { Order, Farmer, Hub } from '../types';
import { getDemandForecast } from '../services/geminiService';
import { UsersIcon, MapPinIcon, ChartBarIcon, LogoutIcon } from './Icons';

type AdminViewType = 'DASHBOARD' | 'ORDERS' | 'PROCUREMENT' | 'HUBS' | 'FARMERS';

interface AdminViewProps {
  onLogout: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminViewType>('DASHBOARD');

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
      case 'FARMERS':
        return <FarmerManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">FrescoHub Admin</h2>
        <nav className="flex-grow">
          <ul>
            <li className="mb-4"><button onClick={() => setCurrentView('DASHBOARD')} className="w-full text-left hover:bg-gray-700 p-2 rounded flex items-center gap-3"><ChartBarIcon className="w-5 h-5"/>Dashboard</button></li>
            <li className="mb-4"><button onClick={() => setCurrentView('ORDERS')} className="w-full text-left hover:bg-gray-700 p-2 rounded">Orders</button></li>
            <li className="mb-4"><button onClick={() => setCurrentView('PROCUREMENT')} className="w-full text-left hover:bg-gray-700 p-2 rounded">Procurement</button></li>
            <li className="mb-4"><button onClick={() => setCurrentView('HUBS')} className="w-full text-left hover:bg-gray-700 p-2 rounded flex items-center gap-3"><MapPinIcon className="w-5 h-5"/>Hubs</button></li>
            <li className="mb-4"><button onClick={() => setCurrentView('FARMERS')} className="w-full text-left hover:bg-gray-700 p-2 rounded flex items-center gap-3"><UsersIcon className="w-5 h-5"/>Farmers</button></li>
          </ul>
        </nav>
        <div className="mt-auto">
             <button onClick={onLogout} className="w-full text-left hover:bg-gray-700 p-2 rounded flex items-center gap-3"><LogoutIcon className="w-5 h-5"/>Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

const DemandForecast: React.FC = () => {
    const [forecast, setForecast] = useState<Record<string, number> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFetchForecast = async () => {
        setIsLoading(true);
        const result = await getDemandForecast(mockOrders);
        setForecast(result);
        setIsLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">AI Demand Forecast</h3>
            <button
                onClick={handleFetchForecast}
                disabled={isLoading}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
                {isLoading ? 'Generating...' : 'Generate Next Week\'s Forecast'}
            </button>
            {forecast && (
                <div className="mt-4">
                    <ul className="space-y-2">
                        {Object.entries(forecast).map(([product, quantity]) => (
                            <li key={product} className="flex justify-between items-center text-gray-700">
                                <span>{product}</span>
                                <span className="font-bold">{quantity} units</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}


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
      <DemandForecast />
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
  
const FarmerManagement: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Farmer Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-4">Farmer ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Specialty</th>
                    </tr>
                </thead>
                <tbody>
                    {mockFarmers.map(farmer => (
                        <tr key={farmer.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{farmer.id}</td>
                            <td className="p-4 font-semibold">{farmer.name}</td>
                            <td className="p-4">{farmer.location}</td>
                            <td className="p-4">{farmer.specialty.join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const HubManagement: React.FC = () => {
    const [hubMap, setHubMap] = useState(mockHubFarmerMap);

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Hub & Farmer Mapping</h1>
            <div className="space-y-8">
                {mockHubs.map(hub => (
                    <div key={hub.id} className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2 mb-4">
                            <MapPinIcon className="w-6 h-6 inline-block mr-2 text-indigo-500" />
                            {hub.location} ({hub.postalCodePrefix}*)
                        </h2>
                        <h3 className="font-semibold text-gray-600 mb-2">Assigned Farmers:</h3>
                        <ul className="space-y-2">
                            {(hubMap[hub.id] || []).length > 0 ? (
                                hubMap[hub.id].map(farmerId => {
                                    const farmer = mockFarmers.find(f => f.id === farmerId);
                                    return (
                                        <li key={farmerId} className="p-2 bg-gray-50 rounded-md">
                                            {farmer?.name || 'Unknown Farmer'} - <span className="text-sm text-gray-500">{farmer?.location}</span>
                                        </li>
                                    );
                                })
                            ) : (
                                <li className="text-gray-500">No farmers assigned.</li>
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default AdminView;
