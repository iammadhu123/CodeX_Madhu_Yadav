import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { Calendar, Clock, MapPin, Send, LogIn, User, Mail, Phone, Home } from 'lucide-react';

const BookingForm = ({ service, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    date: '',
    time: '9:00 AM',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Pre-fill user information if available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.location || ''
      }));
    }
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-8 border border-blue-200">
        <div className="text-center">
          <LogIn className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Sign In to Book</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to book this service.</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign In / Register
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('Please log in to book a service');
      return;
    }

    setLoading(true);
    setMessage('');

    const isSample = service._id.startsWith('sample-');

    if (isSample) {
      // Mock demo booking for samples
      const demoBooking = {
        _id: `demo-${Date.now()}`,
        service: service,
        customer: { name: formData.name, email: formData.email, phone: formData.phone },
        provider: service.provider,
        date: formData.date,
        time: formData.time,
        location: formData.address,
        notes: formData.description,
        status: 'demo-pending',
        totalPrice: service.price,
        createdAt: new Date().toISOString()
      };

      const demoBookings = JSON.parse(localStorage.getItem('demoBookings') || '[]');
      demoBookings.unshift(demoBooking);
      localStorage.setItem('demoBookings', JSON.stringify(demoBookings));

      setMessage('Demo booking created! Check your bookings page.');
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.location || '',
        date: '',
        time: '9:00 AM',
        description: ''
      });
      if (onClose) {
        setTimeout(() => onClose(), 1500);
      }
      setLoading(false);
      return;
    }

    try {
      await axios.post('/bookings', {
        serviceId: service._id,
        date: formData.date,
        time: formData.time,
        location: formData.address,
        notes: formData.description,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        }
      });
      setMessage('Booking request submitted successfully! Check your dashboard for updates.');
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.location || '',
        date: '',
        time: '9:00 AM',
        description: ''
      });
      if (onClose) {
        setTimeout(() => onClose(), 1500);
      } else {
        setTimeout(() => {
          window.location.href = '/bookings';
        }, 2000);
      }
    } catch (error) {
      setMessage(error.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM'
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border">
<div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-2xl p-6 mb-8 text-center">
          <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
          <div className="flex flex-wrap items-center gap-4 justify-center text-lg">
            <span>₹{service.price}/hr</span>
            <span className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} fill="currentColor" className="h-5 w-5" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3 .921-.755 1.688-1.54 1.118l-2.8-1.512a1 1 0 00-1.175 0l-2.8 1.512c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>({service.rating?.toFixed(1) || 'N/A'})</span>
            </span>
            <span className="flex items-center gap-1 text-sm">
              <MapPin className="h-4 w-4" />
              {service.location}
            </span>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Complete Booking Details</h2>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('Demo') || message.includes('successfully')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Your Information Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="mr-2 h-5 w-5" />
            Your Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+91 98765 43210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Address
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Main St"
              />
            </div>
          </div>
        </div>

        {/* Select Date & Time Section */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="mr-2 h-5 w-5" />
            Select Date & Time
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pick a date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select time</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeSlots.map((time) => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Service Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Please describe the service you need...
          </label>
          <textarea
            rows="4"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Describe your specific requirements, any special instructions, or additional details about the service you need..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-lg"
        >
          <Send size={20} />
          <span>{loading ? 'Submitting...' : 'Submit Booking Request'}</span>
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
