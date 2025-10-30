export const olaMapApi = async (searchKey = '') => {
  const apiKey = "vffQiFY9zFnpm6PJbUt2zHYWcYMFw3ZP1Nd7ilDU";
  const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
    searchKey
  )}&api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
