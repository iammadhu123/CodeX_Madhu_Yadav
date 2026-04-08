import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';

const categories = ['cleaning', 'plumbing', 'electrical', 'gardening', 'tutoring', 'other'];

const EditService = () => {
  const { user, token } = useAuth();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'cleaning',
    price: '',
    duration: '1 hour',
    location: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [service, setService] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const navigate = useNavigate();

  // Check auth and load service data
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    if (user === null) {
      return;
    }
    setAuthReady(true);
    if (user.role !== 'provider') {
      navigate('/dashboard');
    }
  }, [token, user, navigate]);

  // Load service data
  useEffect(() => {
    if (!authReady) return;

    const loadService = async () => {
      try {
        const res = await axios.get(`/services/${id}`);
        const serviceData = res.data.data;
        
        // Check if user is the provider
        if (serviceData.provider._id !== user?.id) {
          setFetchError('You do not have permission to edit this service');
          setTimeout(() => navigate('/dashboard'), 2000);
          return;
        }
        
        setService(serviceData);
        setFormData({
          title: serviceData.title,
          description: serviceData.description,
          category: serviceData.category,
          price: serviceData.price.toString(),
          duration: serviceData.duration,
          location: serviceData.location
        });
      } catch (error) {
        setFetchError('Service not found');
        setTimeout(() => navigate('/services'), 2000);
      }
    };

    loadService();
  }, [authReady, id, user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put(`/services/${id}`, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        duration: formData.duration,
        location: formData.location
      });
      setMessage('Service updated successfully!');
      setTimeout(() => navigate(`/services/${id}`), 1200);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Unable to update service');
    } finally {
      setLoading(false);
    }
  };

  if (!authReady) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{fetchError}</p>
          <p className="text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return <div className="min-h-screen flex items-center justify-center">Loading service...</div>;
  }

  return (
    <div className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Edit Service</h1>
          <p className="text-gray-600">Update your service details.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.includes('successfully') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Professional plumber service"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                required
                rows="5"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the service, pricing, and what customers can expect"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input
                  type="text"
                  required
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1 hour"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g. Downtown, Westside, Central Park"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => navigate(`/services/${id}`)}
                className="flex-1 bg-gray-200 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditService;
