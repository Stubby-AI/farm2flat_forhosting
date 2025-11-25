
import React, { useState } from 'react';
import UserView from './components/UserView';
import AdminView from './components/AdminView';
import PortalLogin from './components/PortalLogin';
import FarmerView from './components/FarmerView';
import BusinessView from './components/BusinessView';
import { PortalUser } from './types';
import { mockFarmers, mockBusinesses } from './mock/data';

type AppMode = 'USER' | 'PORTAL';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('USER');
  const [loggedInPortalUser, setLoggedInPortalUser] = useState<PortalUser | null>(null);
  
  // Demo Code State
  const [showDemoPrompt, setShowDemoPrompt] = useState(false);
  const [demoCode, setDemoCode] = useState('');
  const [demoError, setDemoError] = useState('');

  const handlePortalLogin = (user: PortalUser) => {
    setLoggedInPortalUser(user);
  };

  const handlePortalLogout = () => {
    setLoggedInPortalUser(null);
  };
  
  const handleSwitchModeClick = () => {
    if (mode === 'USER') {
        setShowDemoPrompt(true);
    } else {
        setLoggedInPortalUser(null);
        setMode('USER');
    }
  };

  const verifyDemoCode = (e: React.FormEvent) => {
      e.preventDefault();
      if (demoCode === '23112011') {
          setMode('PORTAL');
          setShowDemoPrompt(false);
          setDemoCode('');
          setDemoError('');
      } else {
          setDemoError('Invalid Demo Code');
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
        const farmerProfile = mockFarmers.find(f => f.id === loggedInPortalUser.id.replace('farmer', 'f'));
        if (!farmerProfile) return <p>Error: Could not find farmer profile.</p>
        return <FarmerView farmer={farmerProfile} onLogout={handlePortalLogout} />;
      case 'business':
        const businessProfile = mockBusinesses.find(b => b.id === loggedInPortalUser.id.replace('biz', 'b'));
        if (!businessProfile) return <p>Error: Could not find business profile.</p>
        return <BusinessView business={businessProfile} onLogout={handlePortalLogout} />;
      default:
        // This case should not be reachable if logic is correct
        return <PortalLogin onLoginSuccess={handlePortalLogin} />;
    }
  };

  return (
    <>
      {showDemoPrompt && (
           <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
               <form onSubmit={verifyDemoCode} className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                   <h3 className="text-xl font-bold mb-4 text-gray-800">Enter Demo Code</h3>
                   <p className="text-gray-600 mb-4 text-sm">Please enter the access code to view the Business Portal demo.</p>
                   <input 
                     type="password" 
                     value={demoCode} 
                     onChange={e => setDemoCode(e.target.value)} 
                     className="border p-3 rounded w-full mb-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                     placeholder="Access Code"
                     autoFocus
                   />
                   {demoError && <p className="text-red-500 text-sm mb-4 font-semibold">{demoError}</p>}
                   <div className="flex justify-end gap-3">
                       <button 
                        type="button" 
                        onClick={() => { setShowDemoPrompt(false); setDemoError(''); setDemoCode(''); }} 
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                       >
                           Cancel
                       </button>
                       <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 font-semibold">Submit</button>
                   </div>
               </form>
           </div>
       )}

      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleSwitchModeClick}
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
