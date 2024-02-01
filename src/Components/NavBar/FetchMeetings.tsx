export const fetchHashTable = async () => {
    const basePath = 'public/meetings/'; // Hard-coded base path
    try {
      const response = await window.electronAPI.fetchHashTable(basePath);
      console.log("Test");
      console.log(response);
      return response;
    } catch (error) {
      console.error('Failed to fetch hash table:', error);
      throw error;
    }
  };
  