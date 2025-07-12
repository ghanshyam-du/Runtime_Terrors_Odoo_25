
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/swaps`;

export const createSwapRequest = async (swapData) => {
  const response = await axios.post(`${API_BASE}/create_swap`, swapData);
  return response.data;
};

export const getSwapRequestsForUser = async (token) => {
  const response = await axios.get(`${API_BASE}/get_swaps`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
