import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingForm from '../components/BookingForm';
import ReviewForm from '../components/ReviewForm';
import axios from '../api/axios';
import { ArrowLeft, Star, MessageCircle, Edit, Trash2 } from 'lucide-react';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchService();
    fetchReviews();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await axios.get(`/services/${id}`);
      setService(res.data.data);
    } catch (error) {
      console.error('Error fetching service:', error);
      navigate('/services');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`/reviews/${id}`);
      setReviews(res.data.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;

    setDeleting(true);
    try {
      await axios.delete(`/services/${id}`);
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen py-24 text-center">Loading...</div>;
  }

  if (!service) {
    return <div className="min-h-screen py-24 text-center">Service not found</div>;
  }

  const isProvider = user?.id === service.provider._id;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 'N/A';

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Back button */}
        <button 
          onClick={() => navigate('/services')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to services
        </button>

        {/* Header with edit/delete buttons */}
        <div className="flex justify-between items-start mb-8">
          <h1 className="text-4xl font-bold text-gray-900">{service.title}</h1>
          {isProvider && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/services/${id}/edit`)}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Edit size={18} />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 size={18} />
                Delete
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-200 p-5 bg-slate-50">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Price</p>
                <p className="text-2xl font-semibold text-gray-900">${service.price}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-5 bg-slate-50">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Duration</p>
                <p className="text-lg font-semibold text-gray-900">{service.duration}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-5 bg-slate-50">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Location</p>
                <p className="text-lg font-semibold text-gray-900">{service.location}</p>
              </div>
              <div className="rounded-2xl border border-gray-200 p-5 bg-slate-50">
                <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">Category</p>
                <p className="text-lg font-semibold text-gray-900">{service.category}</p>
              </div>
            </div>

            <div className="mt-10 rounded-3xl border border-gray-200 p-8 bg-white">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Provider</h2>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                  {service.provider?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{service.provider?.name}</p>
                  <p className="text-sm text-gray-500">{service.provider?.email}</p>
                  <p className="text-sm text-gray-500">{service.provider?.location}</p>
                </div>
              </div>
            </div>
          </div>

          <BookingForm service={service} />
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <div className="flex items-center mb-8">
            <div className="flex items-center space-x-1 mr-4">
              <Star className="h-7 w-7 text-yellow-400 fill-current" />
              <span className="text-3xl font-bold text-gray-900">{averageRating}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">({reviews.length} reviews)</div>
          </div>

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-1 mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">{review.customer?.name}</span>
                  </div>
                  {review.comment && (
                    <p className="text-gray-700">{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>
        </div>

        {/* Review Form */}
        <ReviewForm serviceId={id} onReviewSubmitted={fetchReviews} />
      </div>
    </div>
  );
};

export default ServiceDetail;
