import React, { useState } from 'react';
import { mockPortalUsers, mockUser, mockDrivers, mockVehicles, mockRoutes, mockSeasonalTrends, mockCampaigns, mockTickets, mockFarmers, mockSourcedProducts } from '../mock/data';
import { Farmer, SourcedProduct } from '../types';
import { 
    UsersGroupIcon, TruckIcon, CalendarDaysIcon, ChartBarIcon, MegaphoneIcon, 
    ExclamationTriangleIcon, LogoutIcon, SparklesIcon, BuildingOffice2Icon,
    CubeTransparentIcon, CheckBadgeIcon
} from './Icons';

type AdminViewType = 
    'USERS' | 'SUPPLIERS' | 'PRODUCT_CURATION' | 'PUBLISHED_PRODUCTS' |
    'LOGISTICS' | 'SEASONALITY' | 'ANALYTICS' | 'MARKETING' | 'DISPUTES';

interface AdminViewProps {
  onLogout: () => void;
}

const AdminView: React.FC<AdminViewProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<AdminViewType>('SUPPLIERS');
  const [sourcedProducts, setSourcedProducts] = useState<SourcedProduct[]>(mockSourcedProducts);

  const handlePublishProduct = (productId: string) => {
    const product = sourcedProducts.find(p => p.id === productId);
    if (!product) return;

    const suggestedPrice = (product.costPrice * 1.4).toFixed(2);
    const priceInput = prompt(`Enter selling price for ${product.name} (suggested: $${suggestedPrice}):`, suggestedPrice);

    if (priceInput !== null) {
      const sellingPrice = parseFloat(priceInput);
      if (!isNaN(sellingPrice) && sellingPrice > 0) {
        setSourcedProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === productId ? { ...p, isPublished: true, sellingPrice: sellingPrice } : p
          )
        );
      } else {
        alert("Invalid price entered.");
      }
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'USERS': return <UserManagementView />;
      case 'SUPPLIERS': return <SupplierManagementView />;
      case 'PRODUCT_CURATION': return <ProductCurationView products={sourcedProducts} onPublish={handlePublishProduct} />;
      case 'PUBLISHED_PRODUCTS': return <PublishedProductsView products={sourcedProducts.filter(p => p.isPublished)} />;
      case 'LOGISTICS': return <LogisticsManagementView />;
      case 'SEASONALITY': return <SeasonalityView />;
      case 'ANALYTICS': return <AnalyticsView />;
      case 'MARKETING': return <MarketingView />;
      case 'DISPUTES': return <DisputeManagementView />;
      default: return <SupplierManagementView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">FrescoHub Admin</h2>
        <nav className="flex-grow">
          <ul className="space-y-1">
            <NavItem icon={<UsersGroupIcon className="w-5 h-5"/>} label="User Management" active={currentView === 'USERS'} onClick={() => setCurrentView('USERS')} />
            <hr className="border-gray-700 my-2" />
            <NavItem icon={<BuildingOffice2Icon className="w-5 h-5"/>} label="Supplier Management" active={currentView === 'SUPPLIERS'} onClick={() => setCurrentView('SUPPLIERS')} />
            <NavItem icon={<CubeTransparentIcon className="w-5 h-5"/>} label="Product Curation" active={currentView === 'PRODUCT_CURATION'} onClick={() => setCurrentView('PRODUCT_CURATION')} />
            <NavItem icon={<CheckBadgeIcon className="w-5 h-5"/>} label="Published Products" active={currentView === 'PUBLISHED_PRODUCTS'} onClick={() => setCurrentView('PUBLISHED_PRODUCTS')} />
            <hr className="border-gray-700 my-2" />
            <NavItem icon={<TruckIcon className="w-5 h-5"/>} label="Hub & Logistics" active={currentView === 'LOGISTICS'} onClick={() => setCurrentView('LOGISTICS')} />
            <NavItem icon={<CalendarDaysIcon className="w-5 h-5"/>} label="Seasonality Intel" active={currentView === 'SEASONALITY'} onClick={() => setCurrentView('SEASONALITY')} />
            <NavItem icon={<ChartBarIcon className="w-5 h-5"/>} label="Analytics & Reports" active={currentView === 'ANALYTICS'} onClick={() => setCurrentView('ANALYTICS')} />
            <NavItem icon={<MegaphoneIcon className="w-5 h-5"/>} label="Marketing" active={currentView === 'MARKETING'} onClick={() => setCurrentView('MARKETING')} />
            <NavItem icon={<ExclamationTriangleIcon className="w-5 h-5"/>} label="Dispute Mgmt" active={currentView === 'DISPUTES'} onClick={() => setCurrentView('DISPUTES')} />
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

// #region Reusable Components
const NavItem: React.FC<{icon: React.ReactNode, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
    <li>
        <button onClick={onClick} className={`w-full text-left p-2 rounded flex items-center gap-3 transition-colors text-sm ${active ? 'bg-gray-700' : 'hover:bg-gray-700'}`}>
            {icon}
            {label}
        </button>
    </li>
);

const AiInsight: React.FC<{ title: string, content: string }> = ({ title, content }) => (
    <div className="bg-indigo-50 p-4 rounded-lg border-l-4 border-indigo-500 mt-8">
        <h3 className="font-bold text-indigo-800 flex items-center gap-2">
            <SparklesIcon className="w-5 h-5" />
            AI Insight: {title}
        </h3>
        <p className="text-indigo-700 mt-1 text-sm">{content}</p>
    </div>
);
// #endregion

// #region Views
const UserManagementView: React.FC = () => {
    const allUsers = [...mockPortalUsers, { id: mockUser.id, email: mockUser.email, name: mockUser.name, role: 'user' as const }];
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">User & Role Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead><tr className="border-b"><th className="p-4">User ID</th><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Role</th></tr></thead>
                    <tbody>
                        {allUsers.map(user => (
                            <tr key={user.id} className="border-b hover:bg-gray-50">
                                <td className="p-4">{user.id}</td>
                                <td className="p-4 font-semibold">{user.name}</td>
                                <td className="p-4">{user.email}</td>
                                <td className="p-4 capitalize">{user.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <AiInsight title="Anomalous Activity" content="Farmer account 'farmer@greenacres.com' logged in from a new location (IP: 192.168.1.100) outside of normal operating hours. Recommend monitoring." />
        </div>
    );
};

const SupplierManagementView: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Supplier / Farmer Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-4">Supplier Name</th>
                        <th className="p-4">Location</th>
                        <th className="p-4">Specialty</th>
                        <th className="p-4">AI Performance Score</th>
                    </tr>
                </thead>
                <tbody>
                    {mockFarmers.map(farmer => (
                        <tr key={farmer.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-semibold">{farmer.name}</td>
                            <td className="p-4">{farmer.location}</td>
                            <td className="p-4">{farmer.specialty.join(', ')}</td>
                            <td className="p-4 font-bold text-center">{farmer.performanceScore || 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AiInsight title="Supplier Reliability" content="Sunnyvale Orchards (Score: 95) consistently delivers high-quality produce on time. Prioritize procurement from them for key fruit products." />
    </div>
);

const ProductCurationView: React.FC<{products: SourcedProduct[], onPublish: (id: string) => void}> = ({ products, onPublish }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Curation</h1>
        <p className="text-gray-600 mb-6 -mt-4">Review products from all suppliers and publish them to the main platform.</p>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-4">Product</th>
                        <th className="p-4">Supplier</th>
                        <th className="p-4">Cost Price</th>
                        <th className="p-4">AI Suggested Price</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-semibold">{product.name}</td>
                            <td className="p-4">{product.supplierName}</td>
                            <td className="p-4">${product.costPrice.toFixed(2)}</td>
                            <td className="p-4 font-bold text-green-600">${(product.costPrice * 1.4).toFixed(2)}</td>
                            <td className="p-4">
                                {product.isPublished ? (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Published</span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-800">Unpublished</span>
                                )}
                            </td>
                            <td className="p-4">
                                {!product.isPublished && (
                                    <button onClick={() => onPublish(product.id)} className="bg-blue-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-blue-600 text-sm">Publish</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AiInsight title="High Demand Product" content="'Strawberries' from Green Acres Farm have high search volume. Recommend publishing immediately with a premium markup to capture market interest." />
    </div>
);

const PublishedProductsView: React.FC<{ products: SourcedProduct[] }> = ({ products }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Published (Final) Products</h1>
         <p className="text-gray-600 mb-6 -mt-4">This is the final list of products available to customers on the platform.</p>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                    <tr className="border-b">
                        <th className="p-4">Product</th>
                        <th className="p-4">Supplier</th>
                        <th className="p-4">Cost Price</th>
                        <th className="p-4">Selling Price</th>
                        <th className="p-4">Margin</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-semibold">{product.name}</td>
                            <td className="p-4">{product.supplierName}</td>
                            <td className="p-4">${product.costPrice.toFixed(2)}</td>
                            <td className="p-4 font-bold text-gray-800">${product.sellingPrice?.toFixed(2)}</td>
                            <td className="p-4 font-semibold text-green-700">
                                {product.sellingPrice ? `${(((product.sellingPrice - product.costPrice) / product.costPrice) * 100).toFixed(0)}%` : 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AiInsight title="Pricing Optimization" content="The current 40% margin on 'Organic Carrots' is below the category average of 55%. Consider a price increase to $2.79 to improve profitability without significantly impacting demand." />
    </div>
);

const LogisticsManagementView: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Hub & Logistics Management</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Drivers & Vehicles</h2>
                <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead><tr className="border-b"><th className="p-2">Driver</th><th className="p-2">Vehicle Plate</th><th className="p-2">Status</th></tr></thead>
                        <tbody>
                            {mockDrivers.map(d => {
                                const vehicle = mockVehicles.find(v => v.id === d.vehicleId);
                                return (<tr key={d.id} className="border-b hover:bg-gray-50"><td className="p-2">{d.name}</td><td className="p-2">{vehicle?.licensePlate}</td><td className="p-2">{d.status}</td></tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-2 text-gray-700">Active Routes</h2>
                <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                     <table className="w-full text-left text-sm">
                        <thead><tr className="border-b"><th className="p-2">Route ID</th><th className="p-2">Driver</th><th className="p-2">Status</th><th className="p-2">Est. Completion</th></tr></thead>
                        <tbody>
                            {mockRoutes.map(r => {
                                const driver = mockDrivers.find(d => d.id === r.driverId);
                                return (<tr key={r.id} className="border-b hover:bg-gray-50"><td className="p-2">{r.id}</td><td className="p-2">{driver?.name}</td><td className="p-2">{r.status}</td><td className="p-2">{r.estimatedCompletion}</td></tr>)
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <AiInsight title="Route Optimization" content="Route r1 is experiencing a 15-minute delay due to traffic on HWY 401. Suggest rerouting driver Carlos Ray via Queen St to maintain delivery schedule. Predicted fuel savings: 2%." />
    </div>
);

const SeasonalityView: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Seasonality & Availability Intelligence</h1>
         <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="border-b"><th className="p-4">Product</th><th className="p-4">Trend</th><th className="p-4">Peak Months</th></tr></thead>
                <tbody>
                    {mockSeasonalTrends.map(t => (
                        <tr key={t.productId} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-semibold">{t.productName}</td>
                            <td className="p-4">{t.trend}</td>
                            <td className="p-4">{t.months.map(m => new Date(2000, m).toLocaleString('default', { month: 'short' })).join(', ')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AiInsight title="Supply-Demand Mismatch" content="Asparagus supply is trending low, but demand from business customers has increased by 18%. Recommend notifying farmers to increase stock and consider a temporary price adjustment of +8%." />
    </div>
);

const AnalyticsView: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Analytics & Reporting</h1>
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">Centralized dashboards for revenue, customer trends, and performance metrics are coming soon.</p>
        </div>
        <AiInsight title="Revenue & Churn Prediction" content="Projected monthly revenue is on track for $15,200 (+5% MoM). AI detects a 12% churn risk for users with only one order in the last 90 days. Suggest targeting them with the 'Welcome Back' campaign." />
    </div>
);

const MarketingView: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Marketing & Notifications</h1>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="border-b"><th className="p-4">Campaign Name</th><th className="p-4">Target Segment</th><th className="p-4">Channel</th><th className="p-4">Status</th><th className="p-4">Engagement</th></tr></thead>
                <tbody>
                    {mockCampaigns.map(c => (
                        <tr key={c.id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-semibold">{c.name}</td>
                            <td className="p-4">{c.targetSegment}</td>
                            <td className="p-4">{c.channel}</td>
                            <td className="p-4">{c.status}</td>
                            <td className="p-4">{c.engagementRate ? `${c.engagementRate}%` : 'N/A'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AiInsight title="Campaign Personalization" content="For the 'Weekly Veggie Box Promo' campaign, AI suggests personalizing offers based on past purchases. Example: Offer a discount on a Fruit Box to users who have never ordered fruit before. Predicted engagement uplift: +15%." />
    </div>
);

const DisputeManagementView: React.FC = () => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dispute & Issue Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="border-b"><th className="p-4">Ticket ID</th><th className="p-4">User</th><th className="p-4">Subject</th><th className="p-4">Priority</th><th className="p-4">Status</th></tr></thead>
                <tbody>
                    {mockTickets.map(t => (
                        <tr key={t.id} className="border-b hover:bg-gray-50">
                            <td className="p-4">{t.id}</td>
                            <td className="p-4">{t.userName} ({t.userRole})</td>
                            <td className="p-4 font-semibold">{t.subject}</td>
                            <td className="p-4">{t.priority}</td>
                            <td className="p-4">{t.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <AiInsight title="Auto-Prioritization & Summary" content="Ticket #t2 ('Payment not received') has been auto-prioritized to 'Urgent' based on keywords 'payment' and 'account'. Summary: Farmer John is missing a quarterly payment and requires immediate finance team follow-up." />
    </div>
);
// #endregion

export default AdminView;