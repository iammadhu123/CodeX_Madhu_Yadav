import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { Star, Send } from 'lucide-react';

const ReviewForm = ({ serviceId, onReviewSubmitted }) => {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post('/reviews', {
        service: serviceId,
        rating: Number(rating),
        comment
      });
      setMessage('Review submitted successfully!');
      setComment('');
      setRating(5);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200 text-center">
        <p className="text-gray-600">Please log in to leave a review.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Leave a Review</h3>

      {message && (
        <div className={`p-4 rounded-lg mb-6 ${
          message.includes('successfully')
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Rating</label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none transition-transform hover:scale-125"
              >
                <Star
                  size={32}
                  fill={star <= rating ? 'currentColor' : 'none'}
                  className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
                />
              </button>
            ))}
            <span className="text-lg font-semibold text-gray-900 ml-2">{rating}/5</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Comment (optional)</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows="4"
            placeholder="Share your experience with this service..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">{comment.length}/500</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <Send size={20} />
          <span>{loading ? 'Submitting...' : 'Submit Review'}</span>
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
