import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Plus, Calendar, FileText, BookOpen } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [myServices, setMyServices] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [servicesRes, bookingsRes] = await Promise.all([
        axios.get('/services/my-services'),
        axios.get('/bookings/my-bookings')
      ]);
      setMyServices(servicesRes.data.data || []);
      setMyBookings(bookingsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen py-24 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Welcome Card */}
          <div className="lg:col-span-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-8">
            <h1 className="text-3xl font-bold mb-4">Welcome back, {user?.name}!</h1>
            <p className="text-blue-100 mb-6">Here's what's happening with your account</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span>{myBookings.length} Bookings</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6" />
                <span>{myServices.length} Services</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {user?.role === 'provider' ? (
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <Plus className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Add New Service</h3>
                </div>
                <p className="text-gray-600 mb-6">List your services for others to book</p>
                <button onClick={() => navigate('/add-service')} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium">
                  Create Service
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <Plus className="h-8 w-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-bold text-gray-900">Provider Access</h3>
                </div>
                <p className="text-gray-600 mb-6">Register as a provider to list services and manage bookings.</p>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-4">
                <FileText className="h-8 w-8 text-green-600 mr-3" />
                <h3 className="text-xl font-bold text-gray-900">Manage Bookings</h3>
              </div>
              <p className="text-gray-600 mb-6">View and manage your upcoming jobs</p>
              <button onClick={() => navigate('/bookings')} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-medium">
                View Bookings
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Services */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <BookOpen className="h-8 w-8 mr-3 text-blue-600" />
              My Services ({myServices.length})
            </h3>
            <div className="space-y-4">
              {myServices.length > 0 ? (
                myServices.slice(0, 3).map((service) => (
                  <div key={service._id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <h4 className="font-semibold text-gray-900">{service.title}</h4>
                    <p className="text-sm text-gray-600">{service.category} • ${service.price}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No services yet. Create your first service!
                </div>
              )}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="h-8 w-8 mr-3 text-green-600" />
              Recent Bookings ({myBookings.length})
            </h3>
            <div className="space-y-4">
              {myBookings.length > 0 ? (
                myBookings.slice(0, 3).map((booking) => (
                  <div key={booking._id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-gray-900">{booking.service?.title}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                        booking.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No bookings yet. Find services to book!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
