"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSwap } from "@/contexts/SwapContext";
import { fetchPublicUsers } from "@/services/userService";
import Image from "next/image";

export default function Browse() {
  const { user } = useAuth();
  const { createSwapRequest } = useSwap();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchPublicUsers();
        const filtered = users.filter(
          (u) =>
            u.id !== user?.id &&
            (u.skills_offered?.length > 0 || u.skills_wanted?.length > 0)
        );
        setUsers(filtered);
        setFilteredUsers(filtered);
      } catch (err) {
        console.error("Error loading public users:", err);
      }
    };

    loadUsers();
  }, [user]);

  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter((u) => {
        const skills = [
          ...(u.skills_offered || []),
          ...(u.skills_wanted || []),
        ];
        return (
          skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          ) || u.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    if (selectedAvailability) {
      filtered = filtered.filter((u) =>
        u.availability?.includes(selectedAvailability)
      );
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedAvailability, users]);

  const handleSwapRequest = (targetUser) => {
    if (!user) {
      alert("Please login to request a swap");
      return;
    }

    const swapData = {
      requesterId: user.id,
      requesterName: user.name,
      targetId: targetUser.id,
      targetName: targetUser.name,
      message: `Hi ${targetUser.name}, I'd like to exchange skills with you!`,
    };

    createSwapRequest(swapData);
    setSuccessMessage(`Swap request sent to ${targetUser.name}!`);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const availabilityOptions = [
    "Weekdays",
    "Weekends",
    "Evenings",
    "Mornings",
    "Afternoons",
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Browse Skills
          </h1>
          <p className="text-gray-600">
            Discover people to exchange skills with
          </p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by skill or name
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g., JavaScript, Photography, Cooking..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by availability
              </label>
              <select
                value={selectedAvailability}
                onChange={(e) => setSelectedAvailability(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All availability</option>
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            filteredUsers.map((targetUser) => (
              <div
                key={targetUser.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 relative rounded-full overflow-hidden bg-gray-100">
                      {targetUser.profile_photo_url ? (
                        <Image
                          src={targetUser.profile_photo_url}
                          alt={targetUser.name || "User"}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-blue-600 font-semibold">
                          {targetUser.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {targetUser.name}
                      </h3>
                      {targetUser.location && (
                        <p className="text-gray-600 text-sm">
                          {targetUser.location}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Skills Offered */}
                  {targetUser.skills_offered &&
                    targetUser.skills_offered.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Can teach:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {targetUser.skills_offered
                            .slice(0, 3)
                            .map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                          {targetUser.skills_offered.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{targetUser.skills_offered.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Skills Wanted */}
                  {targetUser.skills_wanted &&
                    targetUser.skills_wanted.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Wants to learn:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {targetUser.skills_wanted.slice(0, 3).map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                          {targetUser.skills_wanted.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              +{targetUser.skills_wanted.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                  {/* Availability */}
                  {targetUser.availability &&
                    targetUser.availability.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Available:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {targetUser.availability.map((time) => (
                            <span
                              key={time}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                            >
                              {time}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                  <button
                    onClick={() => handleSwapRequest(targetUser)}
                    disabled={!user}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
                  >
                    {user ? "Request Swap" : "Login to Request"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
