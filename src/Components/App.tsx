import { useState, useEffect } from "react";
import ChatComponent from "./ChatComponent/ChatComponent";
import NavBarComponent from "./NavBar/NavBarComponent";
import { fetchHashTable } from "./NavBar/FetchMeetings";

function App() {
  const [folderOptions, setFolderOptions] = useState<string[]>([]);
  const [fileOptions, setFileOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [hashTable, setHashTable] = useState<
    Record<string, Record<string, string>>
  >({});
  // State for storing the selected file's path
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  // Fetch hash table on component mount
  useEffect(() => {
    const loadHashTable = async () => {
      const table = await fetchHashTable();
      setHashTable(table);
      setFolderOptions(Object.keys(table));
    };
    loadHashTable();
  }, []);

  // Update file options when a folder is selected
  useEffect(() => {
    if (selectedFolder) {
      const files = hashTable[selectedFolder];
      const newFileOptions = Object.entries(files).map(
        ([fileName, filePath]) => ({
          label: fileName, // File name for visual representation
          value: filePath, // File path to use as the value
        })
      );
      setFileOptions(newFileOptions);
    } else {
      setFileOptions([]); // Reset file options if no folder is selected
    }
  }, [selectedFolder, hashTable]);

  // Handle folder selection
  const handleFolderSelect = (folder: string | null) => {
    setSelectedFolder(folder);
    setSelectedFile(null); // Reset file selection
  };

  // Handler for file selection
  const handleFileSelect = (
    selection: { label: string; value: string } | null
  ) => {
    // You need to ensure only the value (file path) is stored
    setSelectedFilePath(selection ? selection.value : null);
  };

  return (
    <>
      <NavBarComponent
        options={folderOptions}
        label="Select Folder"
        onSelect={handleFolderSelect}
      />
      {selectedFolder && (
        <NavBarComponent
          options={fileOptions}
          label="Select File"
          onSelect={handleFileSelect}
        />
      )}
      <ChatComponent link={selectedFilePath} />
    </>
  );
}

export default App;
