import React, { useState } from 'react';
import UserView from './components/UserView';
import AdminView from './components/AdminView';
import PortalLogin from './components/PortalLogin';
import FarmerView from './components/FarmerView';
import BusinessView from './components/BusinessView';
import { PortalUser } from './types';

type AppMode = 'USER' | 'PORTAL';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('USER');
  const [loggedInPortalUser, setLoggedInPortalUser] = useState<PortalUser | null>(null);

  const handlePortalLogin = (user: PortalUser) => {
    setLoggedInPortalUser(user);
  };

  const handlePortalLogout = () => {
    setLoggedInPortalUser(null);
  };
  
  const handleSwitchMode = () => {
    if (mode === 'USER') {
        setMode('PORTAL');
    } else {
        setLoggedInPortalUser(null); // Logout portal user when switching back
        setMode('USER');
    }
  };

  const renderPortalView = () => {
    if (!loggedInPortalUser) {
      return <PortalLogin onLoginSuccess={handlePortalLogin} />;
    }
    switch (loggedInPortalUser.role) {
      case 'admin':
        return <AdminView onLogout={handlePortalLogout} />;
      case 'farmer':
        return <FarmerView user={loggedInPortalUser} onLogout={handlePortalLogout} />;
      case 'business':
        return <BusinessView user={loggedInPortalUser} onLogout={handlePortalLogout} />;
      default:
        // This case should not be reachable if logic is correct
        return <PortalLogin onLoginSuccess={handlePortalLogin} />;
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleSwitchMode}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {mode === 'USER' ? 'Go to Business Portal' : 'Back to Main Site'}
        </button>
      </div>
      
      {mode === 'USER' ? <UserView /> : renderPortalView()}
    </>
  );
};

export default App;
