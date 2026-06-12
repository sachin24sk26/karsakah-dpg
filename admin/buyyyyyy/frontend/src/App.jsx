import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import Login from './pages/Login';
import CropDetails from './pages/CropDetails';
import FarmerDashboard from './pages/FarmerDashboard';
import AddCrop from './pages/AddCrop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import BuyerDashboard from './pages/BuyerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/crop/:id" element={<CropDetails />} />
              <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
              <Route path="/farmer/add-crop" element={<AddCrop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              {/* Additional routes will be added here */}
              <Route path="*" element={<div className="p-20 text-center text-2xl font-bold text-gray-400">Page Coming Soon</div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
