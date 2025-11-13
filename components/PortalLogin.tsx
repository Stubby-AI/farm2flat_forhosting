import React, { useState, useEffect } from 'react';
import { mockPortalUsers } from '../mock/data';
import { PortalUser, PortalUserRole } from '../types';
import { LeafIcon, UsersIcon, UserIcon } from './Icons';

interface PortalLoginProps {
    onLoginSuccess: (user: PortalUser) => void;
}

const PortalLogin: React.FC<PortalLoginProps> = ({ onLoginSuccess }) => {
    const [selectedRole, setSelectedRole] = useState<PortalUserRole>('admin');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const user = mockPortalUsers.find(u => u.role === selectedRole);
        if (user) {
            setEmail(user.email);
            setPassword(user.password || '');
            setError(''); // Clear error on role change
        }
    }, [selectedRole]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const foundUser = mockPortalUsers.find(
            user => user.email === email && user.password === password && user.role === selectedRole
        );

        if (foundUser) {
            onLoginSuccess(foundUser);
        } else {
            setError('Invalid email or password for the selected role.');
        }
    };
    
    const selectedUser = mockPortalUsers.find(u => u.role === selectedRole);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans">
            <div className="w-full max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="bg-green-600 text-white p-12 flex flex-col justify-center items-center text-center rounded-l-lg">
                    <LeafIcon className="w-20 h-20 text-white" />
                    <h1 className="text-4xl font-bold mt-4">FrescoHub</h1>
                    <p className="mt-2 opacity-90">Connecting local farms to your business.</p>
                </div>
                <div className="bg-white p-12 rounded-r-lg shadow-2xl">
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">Portal Login</h2>
                    <p className="text-gray-500 mb-8">For Admins, Farmers, and Business Customers.</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userType">
                                User Type
                            </label>
                            <select
                                id="userType"
                                value={selectedRole}
                                onChange={e => setSelectedRole(e.target.value as PortalUserRole)}
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                            >
                                <option value="admin">Admin</option>
                                <option value="farmer">Farmer</option>
                                <option value="business">Business Customer</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        <div className="mb-6">
                             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-lg bg-gray-50 border focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                                required
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                        <button
                            type="submit"
                            className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition duration-300"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-8 border-t pt-6">
                        <h3 className="font-semibold text-center text-gray-600 mb-4">Dummy Credentials for Demo</h3>
                        <div className="space-y-3 text-sm">
                            {selectedUser && (
                                <div className="p-3 bg-gray-50 rounded-md border text-gray-700">
                                    <p className="font-bold capitalize flex items-center gap-2">
                                        {selectedUser.role === 'admin' && <UserIcon className="w-4 h-4" />}
                                        {selectedUser.role === 'business' && <UsersIcon className="w-4 h-4" />}
                                        {selectedUser.role === 'farmer' && <LeafIcon className="w-4 h-4" />}
                                        {selectedUser.role} User
                                    </p>
                                    <p><span className="font-semibold">Email:</span> {selectedUser.email}</p>
                                    <p><span className="font-semibold">Pass:</span> {selectedUser.password}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PortalLogin;