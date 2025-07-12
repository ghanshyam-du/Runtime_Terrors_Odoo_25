"use client";

import { useState, useEffect, useRef } from "react"; // Added useRef
import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    profilePublic: true,
    skillsOffered: [],
    skillsWanted: [],
    availability: [],
  });
  const [newSkillOffered, setNewSkillOffered] = useState("");
  const [newSkillWanted, setNewSkillWanted] = useState("");
  const [profilePicture, setProfilePicture] = useState(null); // Added for profile picture
  const [profilePictureUrl, setProfilePictureUrl] = useState(""); // Added for preview
  const fileInputRef = useRef(null); // Added ref for file input

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        profilePublic: user.visibility !== false,
        skillsOffered: user.skills_offered || [],
        skillsWanted: user.skills_wanted || [],
        availability: user.availability || [],
      });
      // Set initial profile picture if available
      if (user.profile_photo_url) {
        setProfilePictureUrl(user.profile_photo_url);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle profile picture selection
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePictureUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger file input click
  const triggerFileInput = () => {
    if (isEditing) {
      fileInputRef.current.click();
    }
  };

  const addSkillOffered = () => {
    if (
      newSkillOffered.trim() &&
      !formData.skillsOffered.includes(newSkillOffered.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()],
      }));
      setNewSkillOffered("");
    }
  };

  const removeSkillOffered = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((s) => s !== skill),
    }));
  };

  const addSkillWanted = () => {
    if (
      newSkillWanted.trim() &&
      !formData.skillsWanted.includes(newSkillWanted.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()],
      }));
      setNewSkillWanted("");
    }
  };

  const removeSkillWanted = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((s) => s !== skill),
    }));
  };

  const handleAvailabilityChange = (option) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter((a) => a !== option)
        : [...prev.availability, option],
    }));
  };

  const handleSave = async () => {
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("location", formData.location);
    formDataToSend.append("profilePublic", formData.profilePublic);

    formData.skillsOffered.forEach((skill) => {
      formDataToSend.append("skillsOffered", skill);
    });

    formData.skillsWanted.forEach((skill) => {
      formDataToSend.append("skillsWanted", skill);
    });

    formData.availability.forEach((avail) => {
      formDataToSend.append("availability", avail);
    });

    if (profilePicture) {
      formDataToSend.append("profilePicture", profilePicture); // 🖼️
    }

    await updateProfile(formDataToSend); // 🔁 This will send FormData
    setIsEditing(false);
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                  onClick={triggerFileInput}
                >
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                  className="hidden"
                />
                <div className="text-white">
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <p className="opacity-90">{user?.email}</p>
                  {user?.location && (
                    <p className="opacity-75 text-sm">{user.location}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Rest of your component remains the same */}
          <div className="p-6 space-y-8">
            {/* Basic Information */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{formData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., New York, USA"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {formData.location || "Not specified"}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="profilePublic"
                    checked={formData.profilePublic}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Make my profile public
                  </span>
                </label>
              </div>
            </section>

            {/* Skills Offered */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Skills I Can Offer
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skillsOffered.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkillOffered(skill)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillOffered}
                    onChange={(e) => setNewSkillOffered(e.target.value)}
                    placeholder="Add a skill you can teach"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && addSkillOffered()}
                  />
                  <button
                    onClick={addSkillOffered}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </section>

            {/* Skills Wanted */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Skills I Want to Learn
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skillsWanted.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        onClick={() => removeSkillWanted(skill)}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillWanted}
                    onChange={(e) => setNewSkillWanted(e.target.value)}
                    placeholder="Add a skill you want to learn"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    onKeyPress={(e) => e.key === "Enter" && addSkillWanted()}
                  />
                  <button
                    onClick={addSkillWanted}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Add
                  </button>
                </div>
              )}
            </section>

            {/* Availability */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Availability
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availabilityOptions.map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availability.includes(option)}
                      onChange={() => handleAvailabilityChange(option)}
                      disabled={!isEditing}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
