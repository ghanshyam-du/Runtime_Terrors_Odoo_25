import axios from "axios";

export const fetchPublicUsers = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users/public_users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(response.data);

    return response.data.users; // Array of user objects
  } catch (error) {
    console.error("❌ Failed to fetch public users:", error);
    throw error;
  }
};

export const fetchUserById = async (id) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`
  );
  return res.data;
};
