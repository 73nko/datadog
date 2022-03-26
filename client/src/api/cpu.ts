const API_URL = "http://localhost:3000/api/v1";

export const getUsage = async () => {
  const response = await fetch(`${API_URL}/cpu/usage`);

  if (!response.ok) {
    throw new Error("Failed to fetch usage.");
  }

  const data = await response.json();

  return data;
};
