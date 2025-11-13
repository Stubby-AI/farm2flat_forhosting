import React, { useState, useMemo } from 'react';
import { Business, Product, StaffMember, Supplier, Customer, Order, CartItem, SourcedProduct } from '../types';
import { mockBusinessProducts, mockSourcedProducts } from '../mock/data';
import { 
    LogoutIcon, UsersIcon, ChartBarIcon, BoxIcon, ClipboardListIcon, 
    CurrencyDollarIcon, UsersGroupIcon, BuildingStorefrontIcon, ReceiptPercentIcon,
    UploadIcon, FileDownloadIcon, PrinterIcon, HomeModernIcon, ClipboardDocumentDuplicateIcon
} from './Icons';

type BusinessViewType = 
    'DASHBOARD' | 'PRODUCTS' | 'SUPPLIERS' | 'CUSTOMERS' | 
    'ORDERS' | 'PURCHASES' | 'FINANCIALS' | 'STAFF' | 'FARM2FLAT';

interface BusinessViewProps {
  business: Business;
  onLogout: () => void;
}

const BusinessView: React.FC<BusinessViewProps> = ({ business, onLogout }) => {
  const [currentView, setCurrentView] = useState<BusinessViewType>('DASHBOARD');
  const [products, setProducts] = useState<Product[]>(business.products || mockBusinessProducts);

  const addProductToMenu = (product: Product | CartItem | SourcedProduct) => {
    const newProduct: Product = {
        id: `dup-${product.id}-${Date.now()}`,
        name: product.name,
        // FIX: Use 'costPrice' as a reliable property to discriminate SourcedProduct.
        // The optional 'sellingPrice' is not a safe type guard.
        price: 'costPrice' in product ? product.sellingPrice || 0 : product.price,
        unit: 'unit' in product ? product.unit || '' : '',
        imageUrl: product.imageUrl,
        farmer: business.name,
        moq: 1,
        isSeasonal: false,
    };
    setProducts(prev => [...prev, newProduct]);
    alert(`"${newProduct.name}" has been duplicated to your product list!`);
  };

  const renderView = () => {
    switch (currentView) {
        case 'DASHBOARD':
            return <DashboardView business={business} />;
        case 'PRODUCTS':
            return <ProductManagementView products={products} setProducts={setProducts} />;
        case 'SUPPLIERS':
            return <SupplierManagementView suppliers={business.suppliers || []} />;
        case 'CUSTOMERS':
            return <CustomerManagementView customers={business.customers || []} />;
        case 'ORDERS':
            return <OrderManagementView />;
        case 'PURCHASES':
            return <PurchaseManagementView purchases={business.purchaseHistory || []} />;
        case 'FARM2FLAT':
            return <Farm2FlatSourcingView onDuplicateProduct={addProductToMenu} />;
        case 'FINANCIALS':
            return <FinancialsView />;
        case 'STAFF':
            return <StaffManagementView staff={business.staff || []} />;
        default:
            return <DashboardView business={business} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 bg-blue-800 text-white p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
            <UsersIcon className="w-8 h-8"/>
            <h2 className="text-2xl font-bold">Business Portal</h2>
        </div>
        <nav className="flex-grow">
          <ul className="space-y-2">
            <NavItem icon={<ChartBarIcon className="w-5 h-5" />} label="Dashboard" active={currentView === 'DASHBOARD'} onClick={() => setCurrentView('DASHBOARD')} />
            <NavItem icon={<BoxIcon className="w-5 h-5" />} label="My Products / Menu" active={currentView === 'PRODUCTS'} onClick={() => setCurrentView('PRODUCTS')} />
            <NavItem icon={<ClipboardListIcon className="w-5 h-5" />} label="Customer Orders" active={currentView === 'ORDERS'} onClick={() => setCurrentView('ORDERS')} />
            <NavItem icon={<ReceiptPercentIcon className="w-5 h-5" />} label="My Purchases" active={currentView === 'PURCHASES'} onClick={() => setCurrentView('PURCHASES')} />
            <NavItem icon={<HomeModernIcon className="w-5 h-5" />} label="Farm2Flat Sourcing" active={currentView === 'FARM2FLAT'} onClick={() => setCurrentView('FARM2FLAT')} />
            <NavItem icon={<CurrencyDollarIcon className="w-5 h-5" />} label="Financials" active={currentView === 'FINANCIALS'} onClick={() => setCurrentView('FINANCIALS')} />
            <hr className="border-blue-700 my-2" />
            <NavItem icon={<UsersGroupIcon className="w-5 h-5" />} label="Staff" active={currentView === 'STAFF'} onClick={() => setCurrentView('STAFF')} />
            <NavItem icon={<BuildingStorefrontIcon className="w-5 h-5" />} label="Suppliers" active={currentView === 'SUPPLIERS'} onClick={() => setCurrentView('SUPPLIERS')} />
            <NavItem icon={<UsersIcon className="w-5 h-5" />} label="Customers" active={currentView === 'CUSTOMERS'} onClick={() => setCurrentView('CUSTOMERS')} />
          </ul>
        </nav>
        <div className="mt-auto">
             <button onClick={onLogout} className="w-full text-left hover:bg-blue-700 p-2 rounded flex items-center gap-3"><LogoutIcon className="w-5 h-5"/>Logout</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

// #region Helper & View Components
const NavItem: React.FC<{icon: React.ReactNode, label: string, active: boolean, onClick: () => void}> = ({ icon, label, active, onClick }) => (
    <li>
        <button onClick={onClick} className={`w-full text-left p-2 rounded flex items-center gap-3 transition-colors ${active ? 'bg-blue-600' : 'hover:bg-blue-700'}`}>
            {icon}
            {label}
        </button>
    </li>
);

const DashboardView: React.FC<{ business: Business }> = ({ business }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Welcome, {business.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-600">Total Purchases</h3>
                <p className="text-4xl font-bold text-gray-800">{business.purchaseHistory?.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-600">Pending Orders (from Customers)</h3>
                <p className="text-4xl font-bold text-orange-500">5</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-600">Monthly Spend (on FrescoHub)</h3>
                <p className="text-4xl font-bold text-blue-600">$890.00</p>
            </div>
        </div>
    </div>
);

const ProductManagementView: React.FC<{ products: Product[], setProducts: React.Dispatch<React.SetStateAction<Product[]>> }> = ({ products, setProducts }) => {
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [filters, setFilters] = useState({ name: '', status: 'all' });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleImport = () => {
        // In a real app, this would come from a file upload
        const imported = [...mockBusinessProducts].reverse(); // Simulate different data
        setProducts(imported);
        setLastUpdated(new Date());
        alert('Menu/Products imported successfully!');
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const nameMatch = p.name.toLowerCase().includes(filters.name.toLowerCase());
            const statusMatch = filters.status === 'all' || (p.isSeasonal ? 'Seasonal' : 'Year-Round') === filters.status;
            return nameMatch && statusMatch;
        });
    }, [products, filters]);

    const handleExportCsv = () => {
        const headers = ['Name', 'Price', 'Unit', 'MOQ', 'Seasonal'];
        const rows = filteredProducts.map(p => [
            `"${p.name.replace(/"/g, '""')}"`, p.price, p.unit, p.moq || 'N/A', p.isSeasonal ? 'Yes' : 'No'
        ]);
        let csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "business_products.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePrint = () => {
        const printWindow = window.open('', '', 'height=800,width=1000');
        if (printWindow) {
            printWindow.document.write('<html><head><title>Product / Menu List</title><style>body{font-family:sans-serif;padding:20px} table{width:100%;border-collapse:collapse;margin-top:20px} th,td{border:1px solid #ddd;padding:8px;text-align:left} th{background-color:#f2f2f2} h1{color:#333}</style></head><body>');
            printWindow.document.write('<h1>Product / Menu List</h1>');
            const table = document.getElementById('product-table-business');
            if (table) printWindow.document.write(table.outerHTML);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                 <h1 className="text-3xl font-bold text-gray-800">My Products / Menu</h1>
                 <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600">Add New Item</button>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                 <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Import from File</h3>
                 <div className="flex items-center gap-4">
                    <input type="file" className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                    <button onClick={handleImport} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 flex items-center gap-2">
                        <UploadIcon className="w-5 h-5" /> Import Items
                    </button>
                 </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <input type="text" name="name" placeholder="Item name..." value={filters.name} onChange={handleFilterChange} className="p-2 border rounded-md" />
                    <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border rounded-md bg-white">
                        <option value="all">All Items</option>
                        <option value="Seasonal">Seasonal</option>
                        <option value="Year-Round">Year-Round</option>
                    </select>
                </div>
            </div>

            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <button onClick={handleExportCsv} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 flex items-center gap-2 text-sm"><FileDownloadIcon className="w-4 h-4" />Export to CSV</button>
                    <button onClick={handlePrint} className="bg-gray-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 flex items-center gap-2 text-sm"><PrinterIcon className="w-4 h-4" />Print List</button>
                </div>
                <p className="text-sm text-gray-600">
                    Last Updated: {lastUpdated ? lastUpdated.toLocaleString() : 'Not updated in this session'}
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left" id="product-table-business">
                    <thead><tr className="border-b"><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Unit</th><th className="p-4">MOQ</th><th className="p-4">Seasonal</th></tr></thead>
                    <tbody>
                        {filteredProducts.map(p => (<tr key={p.id} className="border-b hover:bg-gray-50"><td className="p-4">{p.name}</td><td className="p-4">${p.price.toFixed(2)}</td><td className="p-4">{p.unit}</td><td className="p-4">{p.moq || 'N/A'}</td><td className="p-4">{p.isSeasonal ? 'Yes' : 'No'}</td></tr>))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const PurchaseManagementView: React.FC<{ purchases: Order[] }> = ({ purchases }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Purchase History (from FrescoHub)</h1>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="border-b"><th className="p-4">Order ID</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Status</th></tr></thead>
                <tbody>
                    {purchases.map(o => (<tr key={o.id} className="border-b hover:bg-gray-50"><td className="p-4">{o.id}</td><td className="p-4">{o.date}</td><td className="p-4">${o.total.toFixed(2)}</td><td className="p-4">{o.status}</td></tr>))}
                </tbody>
            </table>
        </div>
    </div>
);

const Farm2FlatSourcingView: React.FC<{ onDuplicateProduct: (product: SourcedProduct) => void; }> = ({ onDuplicateProduct }) => {
    const wholesaleProducts = useMemo(() => {
        return mockSourcedProducts.filter(p => 
            p.publishStatus === 'published' && 
            p.publishTarget?.includes('wholesale') && 
            (p.availableQuantity ?? 0) > 0
        );
    }, []);

    return (
        <div>
             <h1 className="text-3xl font-bold mb-2 text-gray-800">Farm2Flat Sourcing Hub</h1>
             <p className="text-gray-600 mb-6">Source products directly from the FrescoHub wholesale catalog. You can add items to your own menu with one click.</p>
             <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-4">Product Name</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Unit</th>
                            <th className="p-4">Available</th>
                            <th className="p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wholesaleProducts.map(item => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="p-4 font-semibold">{item.name}</td>
                                <td className="p-4">${item.sellingPrice?.toFixed(2)}</td>
                                <td className="p-4">{item.unit || 'N/A'}</td>
                                <td className="p-4 font-bold">{item.availableQuantity}</td>
                                <td className="p-4">
                                    <button 
                                        onClick={() => onDuplicateProduct(item)}
                                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md font-semibold hover:bg-blue-200 text-sm flex items-center gap-2"
                                    >
                                        <ClipboardDocumentDuplicateIcon className="w-4 h-4" />
                                        Duplicate to Menu
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
    );
};

const StaffManagementView: React.FC<{ staff: StaffMember[] }> = ({ staff }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Staff Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="border-b"><th className="p-4">Name</th><th className="p-4">Role</th><th className="p-4">Contact</th></tr></thead>
                <tbody>
                    {staff.map(s => (<tr key={s.id} className="border-b hover:bg-gray-50"><td className="p-4">{s.name}</td><td className="p-4">{s.role}</td><td className="p-4">{s.contact}</td></tr>))}
                </tbody>
            </table>
        </div>
    </div>
);

const SupplierManagementView: React.FC<{ suppliers: Supplier[] }> = ({ suppliers }) => (
    <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Supplier Management</h1>
        <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
            <table className="w-full text-left">
                <thead><tr className="border-b"><th className="p-4">Name</th><th className="p-4">Category</th><th className="p-4">Contact</th></tr></thead>
                <tbody>
                    {suppliers.map(s => (<tr key={s.id} className="border-b hover:bg-gray-50"><td className="p-4">{s.name}</td><td className="p-4">{s.category}</td><td className="p-4">{s.contactEmail}</td></tr>))}
                </tbody>
            </table>
        </div>
    </div>
);

const CustomerManagementView: React.FC<{ customers: Customer[] }> = ({ customers }) => {
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    if (selectedCustomer) {
        return (
            <div>
                <button onClick={() => setSelectedCustomer(null)} className="mb-4 text-blue-600 hover:underline font-semibold">
                    &larr; Back to all customers
                </button>
                <h1 className="text-3xl font-bold mb-2 text-gray-800">{selectedCustomer.name}</h1>
                <p className="text-gray-500 mb-6">{selectedCustomer.contactEmail}</p>

                <h2 className="text-2xl font-semibold mb-4 text-gray-700">Order History</h2>
                <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                    {selectedCustomer.orderHistory && selectedCustomer.orderHistory.length > 0 ? (
                         <table className="w-full text-left">
                            <thead>
                                <tr className="border-b"><th className="p-4">Order ID</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Status</th></tr>
                            </thead>
                            <tbody>
                                {selectedCustomer.orderHistory.map(o => (
                                    <tr key={o.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4">{o.id}</td>
                                        <td className="p-4">{o.date}</td>
                                        <td className="p-4">${o.total.toFixed(2)}</td>
                                        <td className="p-4">{o.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : <p>No order history found for this customer.</p>}
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Customer Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                     <thead>
                        <tr className="border-b"><th className="p-4">Name</th><th className="p-4">Type</th><th className="p-4">Contact Email</th></tr>
                    </thead>
                    <tbody>
                        {customers.map(c => (
                            <tr key={c.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedCustomer(c)}>
                                <td className="p-4 font-semibold text-blue-700">{c.name}</td>
                                <td className="p-4">{c.type}</td>
                                <td className="p-4">{c.contactEmail}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const OrderManagementView: React.FC = () => (
     <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Customer Orders</h1>
         <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">A point-of-sale (POS) and order management system for your customers is coming soon.</p>
        </div>
    </div>
);

const FinancialsView: React.FC = () => (
     <div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Financials</h1>
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <p className="text-gray-600 text-lg">Tools for tracking revenue, costs, and profitability are coming soon.</p>
        </div>
    </div>
);

// #endregion

export default BusinessView;
