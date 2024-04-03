interface ElectronAPI {
  fetchHashTable: (basePath: string) => Promise<any>;
  // Add other methods from your preload script as needed
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
    api: {
      receiveSentimentAnalysis: (
        callback: (event: any, arg: string) => void
      ) => void;
    };
  }
}

export {};
