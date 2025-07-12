'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSwap } from '@/contexts/SwapContext';
import { useSearchParams } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Feedback() {
  return (
    <ProtectedRoute>
      <FeedbackContent />
    </ProtectedRoute>
  );
}

function FeedbackContent() {
  const { user } = useAuth();
  const { swaps, submitFeedback, feedback } = useSwap();
  const searchParams = useSearchParams();
  const swapId = searchParams.get('swapId');

  const [formData, setFormData] = useState({
    swapId: swapId || '',
    rating: 5,
    comment: '',
    isAnonymous: false
  });
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [submittedFeedback, setSubmittedFeedback] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const userCompletedSwaps = swaps.filter(swap => 
      (swap.requesterId === user?.id || swap.targetId === user?.id) && 
      swap.status === 'completed'
    );
    setCompletedSwaps(userCompletedSwaps);

    const userFeedback = feedback.filter(f => f.reviewerId === user?.id);
    setSubmittedFeedback(userFeedback);
  }, [swaps, feedback, user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.swapId) {
      alert('Please select a swap to review');
      return;
    }

    const selectedSwap = completedSwaps.find(s => s.id === formData.swapId);
    if (!selectedSwap) {
      alert('Invalid swap selected');
      return;
    }

    const feedbackData = {
      ...formData,
      reviewerId: user.id,
      reviewerName: formData.isAnonymous ? 'Anonymous' : user.name,
      revieweeId: selectedSwap.requesterId === user.id ? selectedSwap.targetId : selectedSwap.requesterId,
      revieweeName: selectedSwap.requesterId === user.id ? selectedSwap.targetName : selectedSwap.requesterName
    };

    submitFeedback(feedbackData);
    setSuccessMessage('Feedback submitted successfully!');
    setFormData({
      swapId: '',
      rating: 5,
      comment: '',
      isAnonymous: false
    });

    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getPartnerName = (swap) => {
    return swap.requesterId === user?.id ? swap.targetName : swap.requesterName;
  };

  const renderStars = (rating, onClick = null) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onClick && onClick(star)}
            className={`w-8 h-8 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            } ${onClick ? 'hover:text-yellow-400 cursor-pointer' : ''}`}
          >
            <svg fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Feedback</h1>
          <p className="text-gray-600">Share your experience and help improve the community</p>
        </div>

        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Feedback Form */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Leave Feedback</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Completed Swap
                </label>
                <select
                  name="swapId"
                  value={formData.swapId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Choose a swap to review...</option>
                  {completedSwaps
                    .filter(swap => !submittedFeedback.some(f => f.swapId === swap.id))
                    .map((swap) => (
                    <option key={swap.id} value={swap.id}>
                      Swap with {getPartnerName(swap)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating
                </label>
                {renderStars(parseInt(formData.rating), (rating) => 
                  setFormData(prev => ({ ...prev, rating }))
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments
                </label>
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Share your experience with this skill swap..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Submit anonymously</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Submit Feedback
              </button>
            </form>
          </div>

          {/* Your Submitted Feedback */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Submitted Feedback</h2>
            
            {submittedFeedback.length === 0 ? (
              <p className="text-gray-600">You haven't submitted any feedback yet.</p>
            ) : (
              <div className="space-y-4">
                {submittedFeedback.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">
                        Review for {item.revieweeName}
                      </h3>
                      {renderStars(item.rating)}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{item.comment}</p>
                    <p className="text-xs text-gray-500">
                      Submitted on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Community Feedback */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Community Feedback</h2>
          
          {feedback.length === 0 ? (
            <p className="text-gray-600">No feedback available yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedback
                .slice(-6)
                .reverse()
                .map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {item.reviewerName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        reviewed {item.revieweeName}
                      </p>
                    </div>
                    {renderStars(item.rating)}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{item.comment}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}