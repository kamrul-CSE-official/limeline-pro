interface LocalDb {
    [key: string]: any; // Define a flexible type for the value (could be any type or specify a stricter type if needed)
  }
  
  const localDb: LocalDb = {}; // In-memory object to store data
  
  const localDbService = {
    // Set or update a key-value pair
    set: (key: string, value: any, value: any, p0: string): void => {
      localDb[key] = value;
    },
  
    // Get a value by key
    get: (key: string): any | null => {
      return localDb[key] || null;
    },
  
    // Delete a key-value pair by key
    delete: (key: string): void => {
      delete localDb[key];
    },
  
    // Clear all data
    clear: (): void => {
      for (const key in localDb) {
        delete localDb[key];
      }
    },
  };
  
  export default localDbService;
  