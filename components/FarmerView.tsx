import React from 'react';
import { PortalUser } from '../types';
import { LeafIcon, LogoutIcon } from './Icons';

interface FarmerViewProps {
  user: PortalUser;
  onLogout: () => void;
}

const FarmerView: React.FC<FarmerViewProps> = ({ user, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-green-800 text-white p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
            <LeafIcon className="w-8 h-8"/>
            <h2 className="text-2xl font-bold">Farmer Portal</h2>
        </div>
        <nav className="flex-grow">
          <ul>
            <li className="mb-4"><button className="w-full text-left bg-green-700 p-2 rounded">Dashboard</button></li>
            <li className="mb-4"><button className="w-full text-left hover:bg-green-700 p-2 rounded">My Products</button></li>
            <li className="mb-4"><button className="w-full text-left hover:bg-green-700 p-2 rounded">Pickup Schedule</button></li>
          </ul>
        </nav>
        <div className="mt-auto">
             <button onClick={onLogout} className="w-full text-left hover:bg-green-700 p-2 rounded flex items-center gap-3"><LogoutIcon className="w-5 h-5"/>Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, {user.name}</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <p>This is your farmer dashboard. Here you can manage your product listings, view procurement requests, and see your pickup schedule.</p>
        </div>
      </main>
    </div>
  );
};

export default FarmerView;
