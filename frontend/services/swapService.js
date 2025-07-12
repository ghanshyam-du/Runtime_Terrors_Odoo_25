import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/swaps`;

// Optional: centralized axios instance (can be reused for auth headers, etc.)
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Create a new skill swap request
 * @param {Object} swapData - swap request details
 * @returns {Promise<Object>} - response from server
 */
export const createSwapRequest = async (swapData) => {
  console.log(swapData);
  try {
    const response = await api.post("/create_swap", swapData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to create swap request:", error);

    const message =
      error?.response?.data?.error ||
      "Failed to send swap request. Please try again.";
    throw new Error(message);
  }
};

/**
 * Get incoming swap requests for a user (requires auth)
 * @param {string} token - JWT auth token
 * @returns {Promise<Object>} - swap requests list
 */
export const getSwapRequestsForUser = async (token) => {
  try {
    const response = await api.get("/get_swaps", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("❌ Failed to fetch swap requests:", error);

    const message =
      error?.response?.data?.error || "Failed to load your swap requests.";
    throw new Error(message);
  }
};

export const updateSwapStatus = async (swapId, status, token) => {
  const response = await axios.patch(
    `${API_BASE}/${swapId}`,
    { status },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data;
};
