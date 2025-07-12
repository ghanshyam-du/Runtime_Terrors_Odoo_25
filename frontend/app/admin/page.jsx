'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSwap } from '@/contexts/SwapContext';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function Admin() {
  return (
    <ProtectedRoute adminOnly={true}>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const { swaps, feedback } = useSwap();
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [announcementText, setAnnouncementText] = useState('');
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);

    const savedAnnouncement = localStorage.getItem('announcement');
    if (savedAnnouncement) {
      setAnnouncementText(savedAnnouncement);
      setShowAnnouncement(true);
    }
  }, []);

  const updateUserStatus = (userId, banned) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, banned } : u
    );
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const handleAnnouncementSave = () => {
    localStorage.setItem('announcement', announcementText);
    setShowAnnouncement(true);
    alert('Announcement updated successfully!');
  };

  const exportData = (type) => {
    let data = [];
    let filename = '';

    switch (type) {
      case 'users':
        data = users.map(u => ({
          name: u.name,
          email: u.email,
          location: u.location,
          skillsOffered: u.skillsOffered?.join(', '),
          skillsWanted: u.skillsWanted?.join(', '),
          createdAt: u.createdAt
        }));
        filename = 'users.csv';
        break;
      case 'swaps':
        data = swaps.map(s => ({
          requester: s.requesterName,
          target: s.targetName,
          status: s.status,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt
        }));
        filename = 'swaps.csv';
        break;
      case 'feedback':
        data = feedback.map(f => ({
          reviewer: f.reviewerName,
          reviewee: f.revieweeName,
          rating: f.rating,
          comment: f.comment,
          createdAt: f.createdAt
        }));
        filename = 'feedback.csv';
        break;
    }

    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    const csv = convertToCSV(data);
    downloadCSV(csv, filename);
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv, filename) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const tabs = [
    { id: 'users', label: 'Users', count: users.length },
    { id: 'swaps', label: 'Swaps', count: swaps.length },
    { id: 'feedback', label: 'Feedback', count: feedback.length },
    { id: 'settings', label: 'Settings', count: null }
  ];

  const getSwapStats = () => {
    return {
      pending: swaps.filter(s => s.status === 'pending').length,
      accepted: swaps.filter(s => s.status === 'accepted').length,
      completed: swaps.filter(s => s.status === 'completed').length,
      rejected: swaps.filter(s => s.status === 'rejected').length
    };
  };

  const swapStats = getSwapStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, swaps, and platform settings</p>
        </div>

        {/* Announcement Banner */}
        {showAnnouncement && announcementText && (
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-lg mb-6">
            <div className="flex items-center justify-between">
              <p className="font-medium">{announcementText}</p>
              <button
                onClick={() => setShowAnnouncement(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">{users.length}</h3>
            <p className="text-gray-600">Total Users</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">{swaps.length}</h3>
            <p className="text-gray-600">Total Swaps</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">{feedback.length}</h3>
            <p className="text-gray-600">Total Feedback</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">{swapStats.completed}</h3>
            <p className="text-gray-600">Completed Swaps</p>
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
                  {tab.count !== null && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                  <button
                    onClick={() => exportData('users')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Export Users
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Skills
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.filter(u => !u.isAdmin).map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              Offers: {user.skillsOffered?.length || 0} skills
                            </div>
                            <div className="text-sm text-gray-500">
                              Wants: {user.skillsWanted?.length || 0} skills
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.banned 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.banned ? 'Banned' : 'Active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => updateUserStatus(user.id, !user.banned)}
                              className={`${
                                user.banned 
                                  ? 'text-green-600 hover:text-green-900' 
                                  : 'text-red-600 hover:text-red-900'
                              }`}
                            >
                              {user.banned ? 'Unban' : 'Ban'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Swaps Tab */}
            {activeTab === 'swaps' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Swap Management</h3>
                  <button
                    onClick={() => exportData('swaps')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Export Swaps
                  </button>
                </div>

                {/* Swap Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-lg font-semibold text-yellow-800">{swapStats.pending}</div>
                    <div className="text-yellow-600">Pending</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-lg font-semibold text-blue-800">{swapStats.accepted}</div>
                    <div className="text-blue-600">Accepted</div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-lg font-semibold text-green-800">{swapStats.completed}</div>
                    <div className="text-green-600">Completed</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-lg font-semibold text-red-800">{swapStats.rejected}</div>
                    <div className="text-red-600">Rejected</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {swaps.map((swap) => (
                    <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">
                            {swap.requesterName} → {swap.targetName}
                          </h4>
                          <p className="text-gray-600 mt-1">{swap.message}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            Created: {new Date(swap.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            swap.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            swap.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {swap.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Feedback Management</h3>
                  <button
                    onClick={() => exportData('feedback')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Export Feedback
                  </button>
                </div>
                
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {item.reviewerName} reviewed {item.revieweeName}
                          </h4>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= item.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-gray-600">{item.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Platform Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform Announcement
                    </label>
                    <textarea
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      rows="3"
                      placeholder="Enter announcement message..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={handleAnnouncementSave}
                      className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Save Announcement
                    </button>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Export Reports</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <button
                        onClick={() => exportData('users')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Export Users CSV
                      </button>
                      <button
                        onClick={() => exportData('swaps')}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Export Swaps CSV
                      </button>
                      <button
                        onClick={() => exportData('feedback')}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Export Feedback CSV
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}