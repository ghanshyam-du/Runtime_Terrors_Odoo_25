'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSwap } from '@/contexts/SwapContext';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function UserProfile() {
  const { user: currentUser } = useAuth();
  const { createSwapRequest } = useSwap();
  const { id } = useParams();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');

  useEffect(() => {
    const loadUserProfile = () => {
      try {
        const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const user = savedUsers.find(u => u.id === id && u.profilePublic !== false);
        
        if (user) {
          // Remove sensitive information
          const { password, ...safeUser } = user;
          setProfileUser(safeUser);
        } else {
          setProfileUser(null);
        }
      } catch (err) {
        console.error('Error loading user profile:', err);
        setProfileUser(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadUserProfile();
    }
  }, [id]);

  const handleSwapRequest = () => {
    if (!currentUser) {
      alert('Please login to request a swap');
      return;
    }

    if (currentUser.id === profileUser.id) {
      alert('You cannot request a swap with yourself');
      return;
    }

    const swapData = {
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      targetId: profileUser.id,
      targetName: profileUser.name,
      message: swapMessage || `Hi ${profileUser.name}, I'd like to exchange skills with you!`
    };

    createSwapRequest(swapData);
    setSuccessMessage(`Swap request sent to ${profileUser.name}!`);
    setShowSwapModal(false);
    setSwapMessage('');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">User not found</h3>
            <p className="text-gray-600 mb-4">This user profile is not available or has been set to private.</p>
            <Link
              href="/browse"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Back to Browse
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get user feedback/ratings
  const savedFeedback = JSON.parse(localStorage.getItem('feedback') || '[]');
  const userFeedback = savedFeedback.filter(f => f.revieweeId === profileUser.id);
  const averageRating = userFeedback.length > 0 
    ? userFeedback.reduce((sum, f) => sum + f.rating, 0) / userFeedback.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 relative rounded-full overflow-hidden bg-white">
                  {profileUser.profile_photo_url ? (
                    <Image
                      src={profileUser.profile_photo_url}
                      alt={profileUser.name || 'User'}
                      layout="fill"
                      objectFit="cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-600">
                      {profileUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{profileUser.name}</h1>
                  {profileUser.location && (
                    <p className="opacity-75 text-sm">{profileUser.location}</p>
                  )}
                  {userFeedback.length > 0 && (
                    <div className="flex items-center mt-2">
                      {renderStars(Math.round(averageRating))}
                      <span className="ml-2 text-sm opacity-90">
                        {averageRating.toFixed(1)} ({userFeedback.length} reviews)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {currentUser && currentUser.id !== profileUser.id && (
                <button
                  onClick={() => setShowSwapModal(true)}
                  className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Request Swap
                </button>
              )}
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Skills Offered */}
            {profileUser.skillsOffered && profileUser.skillsOffered.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Can Offer</h2>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skillsOffered.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Skills Wanted */}
            {profileUser.skillsWanted && profileUser.skillsWanted.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills I Want to Learn</h2>
                <div className="flex flex-wrap gap-2">
                  {profileUser.skillsWanted.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Availability */}
            {profileUser.availability && profileUser.availability.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability</h2>
                <div className="flex flex-wrap gap-2">
                  {profileUser.availability.map((time) => (
                    <span
                      key={time}
                      className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700"
                    >
                      {time}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Member Since */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Member Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600">
                  Member since {new Date(profileUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long'
                  })}
                </p>
              </div>
            </section>

            {/* Recent Feedback */}
            {userFeedback.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Feedback</h2>
                <div className="space-y-4">
                  {userFeedback.slice(-3).reverse().map((feedback) => (
                    <div key={feedback.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {feedback.reviewerName}
                          </h3>
                          {renderStars(feedback.rating)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(feedback.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-600">{feedback.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* Swap Request Modal */}
        {showSwapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Request Skill Swap with {profileUser.name}
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (optional)
                </label>
                <textarea
                  value={swapMessage}
                  onChange={(e) => setSwapMessage(e.target.value)}
                  rows="3"
                  placeholder={`Hi ${profileUser.name}, I'd like to exchange skills with you!`}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSwapRequest}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Send Request
                </button>
                <button
                  onClick={() => {
                    setShowSwapModal(false);
                    setSwapMessage('');
                  }}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}