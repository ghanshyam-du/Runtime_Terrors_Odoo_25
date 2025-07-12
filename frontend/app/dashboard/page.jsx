"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import {
  getSwapRequestsForUser,
  updateSwapStatus as apiUpdateSwapStatus,
} from "@/services/swapService";
import Link from "next/link";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, token } = useAuth();
  const [swaps, setSwaps] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("received");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSwaps = async () => {
      setLoading(true);
      try {
        const data = await getSwapRequestsForUser(token);
        console.log(data);
        setSwaps(data.requests || []);
      } catch (error) {
        console.error("Failed to load swaps:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      loadSwaps();
    }

    const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    setUsers(savedUsers);
  }, [token]);

  const handleStatusChange = async (swapId, status) => {
    try {
      await apiUpdateSwapStatus(swapId, status, token);
      await loadSwaps(); // Refresh after update
    } catch (error) {
      console.error(`Failed to ${status} swap:`, error);
    }
  };

  const receivedRequests = swaps.filter(
    (swap) => swap.targetId === user?.id && swap.status === "pending"
  );

  const sentRequests = swaps.filter(
    (swap) => swap.requesterId === user?.id && swap.status === "pending"
  );

  const acceptedSwaps = swaps.filter(
    (swap) =>
      (swap.targetId === user?.id || swap.requesterId === user?.id) &&
      swap.status === "accepted"
  );

  const tabs = [
    {
      id: "received",
      label: "Pending Requests",
      count: receivedRequests.length,
    },
    { id: "sent", label: "Sent Requests", count: sentRequests.length },
    { id: "accepted", label: "Accepted Swaps", count: acceptedSwaps.length },
  ];

  const getUserName = (userId) => {
    const found = users.find((u) => u.id === userId);
    return found?.name || "Unknown User";
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Manage your skill swap requests and connections
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="New Requests"
            count={receivedRequests.length}
            color="blue"
          />
          <StatCard
            title="Active Swaps"
            count={acceptedSwaps.length}
            color="green"
          />
          <StatCard
            title="Total Skills"
            count={
              (user?.skillsOffered?.length || 0) +
              (user?.skillsWanted?.length || 0)
            }
            color="purple"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-4">
            <LinkButton href="/profile" color="blue" label="Edit Profile" />
            <LinkButton href="/browse" color="green" label="Browse Skills" />
            <LinkButton href="/feedback" color="purple" label="Give Feedback" />
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
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
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
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : (
              <>
                {activeTab === "received" &&
                  renderRequests(
                    receivedRequests,
                    handleStatusChange,
                    "received"
                  )}
                {activeTab === "sent" &&
                  renderRequests(sentRequests, null, "sent")}
                {activeTab === "accepted" &&
                  renderRequests(acceptedSwaps, handleStatusChange, "accepted")}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function renderRequests(swapList, onStatusChange, type) {
  if (!swapList.length) {
    return <p className="text-gray-600">No {type} requests at the moment.</p>;
  }

  return (
    <div className="space-y-4">
      {swapList.map((swap) => (
        <div key={swap.id} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-medium text-gray-900">
                {type === "sent"
                  ? `Request to ${swap.targetName}`
                  : type === "accepted"
                  ? `Swap with ${swap.requesterName}`
                  : `${swap.requesterName} wants to swap skills`}
              </h4>
              <p className="text-gray-600 mt-1">{swap.message}</p>
              <p className="text-sm text-gray-500 mt-2">
                {type === "sent" ? "Sent" : "Requested"} on{" "}
                {new Date(swap.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-3">
              {type === "received" && (
                <>
                  <ActionButton
                    label="Accept"
                    color="green"
                    onClick={() => onStatusChange(swap.id, "accepted")}
                  />
                  <ActionButton
                    label="Reject"
                    color="red"
                    onClick={() => onStatusChange(swap.id, "rejected")}
                  />
                </>
              )}
              {type === "accepted" && (
                <>
                  <ActionButton
                    label="Mark Complete"
                    color="blue"
                    onClick={() => onStatusChange(swap.id, "completed")}
                  />
                  <Link
                    href={`/feedback?swapId=${swap.id}`}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Leave Feedback
                  </Link>
                </>
              )}
              {type === "sent" && (
                <div className="text-yellow-600 font-medium">Pending</div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatCard({ title, count, color }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorMap[color]}`}
        >
          {/* Icon placeholder */}
          <span className="text-xl font-bold">{title[0]}</span>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{count}</h3>
          <p className="text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}

function LinkButton({ href, color, label }) {
  return (
    <Link
      href={href}
      className={`bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-2 rounded-lg font-medium transition-colors`}
    >
      {label}
    </Link>
  );
}

function ActionButton({ label, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bg-${color}-600 hover:bg-${color}-700 text-white px-4 py-2 rounded-lg font-medium transition-colors`}
    >
      {label}
    </button>
  );
}
