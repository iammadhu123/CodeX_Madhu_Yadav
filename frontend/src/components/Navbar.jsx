import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, User, LogOut, Home, List, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center font-bold text-xl text-blue-600">
            ServiceSphere
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600">
              <Home size={20} />
              <span>Home</span>
            </Link>
            <Link to="/services" className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600">
              <List size={20} />
              <span>Services</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600">
                  <LayoutDashboard size={20} />
                  <span>Dashboard</span>
                </Link>
                <div className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 cursor-pointer" onClick={handleLogout}>
                  <LogOut size={20} />
                  <span>Logout</span>
                </div>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <LogIn size={20} />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
