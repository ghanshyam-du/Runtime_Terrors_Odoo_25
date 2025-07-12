'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSwap } from '@/contexts/SwapContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user } = useAuth();
  const { swaps, updateSwapStatus } = useSwap();
  const [activeTab, setActiveTab] = useState('received');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  }, []);

  const getUserName = (userId) => {
    const foundUser = users.find(u => u.id === userId);
    return foundUser?.name || 'Unknown User';
  };

  const receivedRequests = swaps.filter(swap => 
    swap.targetId === user?.id && swap.status === 'pending'
  );

  const sentRequests = swaps.filter(swap => 
    swap.requesterId === user?.id && swap.status === 'pending'
  );

  const acceptedSwaps = swaps.filter(swap => 
    (swap.requesterId === user?.id || swap.targetId === user?.id) && swap.status === 'accepted'
  );

  const handleAcceptSwap = (swapId) => {
    updateSwapStatus(swapId, 'accepted');
  };

  const handleRejectSwap = (swapId) => {
    updateSwapStatus(swapId, 'rejected');
  };

  const handleCompleteSwap = (swapId) => {
    updateSwapStatus(swapId, 'completed');
  };

  const tabs = [
    { id: 'received', label: 'Pending Requests', count: receivedRequests.length },
    { id: 'sent', label: 'Sent Requests', count: sentRequests.length },
    { id: 'accepted', label: 'Accepted Swaps', count: acceptedSwaps.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your skill swap requests and connections</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-6a2 2 0 00-2 2v3a2 2 0 002 2h6a2 2 0 002-2v-3z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{receivedRequests.length}</h3>
                <p className="text-gray-600">New Requests</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{acceptedSwaps.length}</h3>
                <p className="text-gray-600">Active Swaps</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">{(user?.skillsOffered?.length || 0) + (user?.skillsWanted?.length || 0)}</h3>
                <p className="text-gray-600">Total Skills</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/profile"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Edit Profile
            </Link>
            <Link
              href="/browse"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Browse Skills
            </Link>
            <Link
              href="/feedback"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Give Feedback
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Received Requests */}
            {activeTab === 'received' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Requests</h3>
                {receivedRequests.length === 0 ? (
                  <p className="text-gray-600">No pending requests at the moment.</p>
                ) : (
                  <div className="space-y-4">
                    {receivedRequests.map((swap) => (
                      <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              {swap.requesterName} wants to swap skills
                            </h4>
                            <p className="text-gray-600 mt-1">{swap.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Requested on {new Date(swap.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleAcceptSwap(swap.id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRejectSwap(swap.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Sent Requests */}
            {activeTab === 'sent' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sent Requests</h3>
                {sentRequests.length === 0 ? (
                  <p className="text-gray-600">You haven't sent any requests yet.</p>
                ) : (
                  <div className="space-y-4">
                    {sentRequests.map((swap) => (
                      <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              Request to {swap.targetName}
                            </h4>
                            <p className="text-gray-600 mt-1">{swap.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Sent on {new Date(swap.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-yellow-600 font-medium">
                            Pending
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Accepted Swaps */}
            {activeTab === 'accepted' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Swaps</h3>
                {acceptedSwaps.length === 0 ? (
                  <p className="text-gray-600">No active swaps at the moment.</p>
                ) : (
                  <div className="space-y-4">
                    {acceptedSwaps.map((swap) => (
                      <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">
                              Swap with {swap.requesterId === user?.id ? swap.targetName : swap.requesterName}
                            </h4>
                            <p className="text-gray-600 mt-1">{swap.message}</p>
                            <p className="text-sm text-gray-500 mt-2">
                              Started on {new Date(swap.updatedAt || swap.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleCompleteSwap(swap.id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Mark Complete
                            </button>
                            <Link
                              href={`/feedback?swapId=${swap.id}`}
                              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                              Leave Feedback
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}