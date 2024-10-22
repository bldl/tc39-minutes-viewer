// File which utilizes back-end function defined in preload -> main.ts (electron folder)

export const fetchHashTable = async () => {
  const basePath = "public/meetings/"; // Hard-coded base path
  try {
    const response = await window.electronAPI.fetchHashTable(basePath);
    return response;
  } catch (error) {
    console.error("Failed to fetch hash table:", error);
    throw error;
  }
};
