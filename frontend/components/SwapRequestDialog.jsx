"use client";

import { useState } from "react";

export default function SwapRequestDialog({
  isOpen,
  onClose,
  profileUser,
  currentUser,
  onSendRequest,
}) {
  const [swapMessage, setSwapMessage] = useState("");
  const [selectedOfferedSkill, setSelectedOfferedSkill] = useState("");
  const [selectedWantedSkill, setSelectedWantedSkill] = useState("");

  const handleSendRequest = () => {
    const swapData = {
      requesterId: currentUser.id,
      requesterName: currentUser.name,
      targetId: profileUser.id,
      targetName: profileUser.name,
      message:
        swapMessage ||
        `Hi ${profileUser.name}, I'd like to exchange skills with you!`,
      offeredSkill: selectedOfferedSkill,
      wantedSkill: selectedWantedSkill,
    };

    onSendRequest(swapData);

    // Reset form
    setSwapMessage("");
    setSelectedOfferedSkill("");
    setSelectedWantedSkill("");
  };

  const handleClose = () => {
    setSwapMessage("");
    setSelectedOfferedSkill("");
    setSelectedWantedSkill("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Request Skill Swap with {profileUser.name}
        </h3>

        {/* Choose Your Offered Skill */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose one of your offered skills
          </label>
          <select
            value={selectedOfferedSkill}
            onChange={(e) => setSelectedOfferedSkill(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a skill you can offer</option>
            {currentUser?.skills_offered?.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Choose Their Wanted Skill */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Choose one of their wanted skills
          </label>
          <select
            value={selectedWantedSkill}
            onChange={(e) => setSelectedWantedSkill(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a skill they want to learn</option>
            {profileUser?.skills_wanted?.map((skill) => (
              <option key={skill} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>

        {/* Message */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Message (optional)
          </label>
          <textarea
            value={swapMessage}
            onChange={(e) => setSwapMessage(e.target.value)}
            rows={3}
            placeholder={`Hi ${profileUser.name}, I'd like to exchange skills with you!`}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={handleSendRequest}
            disabled={!selectedOfferedSkill || !selectedWantedSkill}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Send Request
          </button>
          <button
            onClick={handleClose}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
