
import React, { useState } from 'react';
import UserView from './components/UserView';
import AdminView from './components/AdminView';

type AppMode = 'USER' | 'ADMIN';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('USER');

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'USER' ? 'ADMIN' : 'USER'));
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMode}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Switch to {mode === 'USER' ? 'Admin' : 'User'} View
        </button>
      </div>
      
      {mode === 'USER' ? <UserView /> : <AdminView />}
    </>
  );
};

export default App;
