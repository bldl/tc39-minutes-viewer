import { useState, useEffect } from "react";
import ChatComponent from "./ChatComponent/ChatComponent";
import NavBarComponent from "./NavBar/NavBarComponent";
import { fetchHashTable } from "./NavBar/FetchMeetings";

function App() {
  const [folderOptions, setFolderOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [fileOptions, setFileOptions] = useState<
    Record<string, { label: string; value: string }[]>
  >({});
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [hashTable, setHashTable] = useState<
    Record<string, Record<string, string>>
  >({});
  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);

  // Fetch hash table on component mount
  useEffect(() => {
    const loadHashTable = async () => {
      const table = await fetchHashTable();
      setHashTable(table);
      // Construct folderOptions from the hash table
      const newFolderOptions = Object.keys(table).map((folderName) => ({
        label: folderName,
        value: folderName, // Assuming the folder name is used as the key in the hashTable
      }));
      setFolderOptions(newFolderOptions);
    };
    loadHashTable();
  }, []);

  // Update file options when a folder is selected
  useEffect(() => {
    if (selectedFolder) {
      const files = hashTable[selectedFolder];
      setFileOptions({
        ...fileOptions,
        [selectedFolder]: Object.entries(files).map(([fileName, filePath]) => ({
          label: fileName, // File name for visual representation
          value: filePath, // File path to use as the value
        })),
      });
    }
    // No else clause needed, as we keep the previous state of fileOptions for other folders
  }, [selectedFolder, hashTable]);

  // Handle folder selection
  const handleFolderSelect = (folderValue: string | null) => {
    setSelectedFolder(folderValue);
    setSelectedFile(null); // Reset file selection
    setSelectedFilePath(null); // Also reset the file path
  };

  // Handler for file selection
  const handleFileSelect = (filePath: string | null) => {
    setSelectedFilePath(filePath); // Store the selected file's path
    // If needed, update selectedFile as well
    if (filePath) {
      const fileName = filePath.split("/").pop();
      setSelectedFile(fileName || null);
    } else {
      setSelectedFile(null);
    }
  };

  return (
    <>
      <NavBarComponent
        folderOptions={folderOptions}
        fileOptions={fileOptions}
        label="Select Folder"
        onSelectFolder={handleFolderSelect}
        onSelectFile={handleFileSelect}
      />
      <ChatComponent link={selectedFilePath} />
    </>
  );
}

export default App;
