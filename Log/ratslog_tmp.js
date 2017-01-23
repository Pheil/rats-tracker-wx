// IndexedDB initializations.
var db;

// Open the file database as "persistent" to get highers quota limits:
const dbReq = indexedDB.open("savedFilesDB", {version: 1, storage: "persistent"});

// Logs errors on opening the db.
dbReq.onerror = evt => {
  dbLog(`ERROR: Fail to open indexedDB 'tempFilesDB' db: ${evt.target.error.message}`);
};

// Create the needed IndexedDB object store.
dbReq.onupgradeneeded = () => {
  const db = dbReq.result;

  dbLog(`Upgrade savedFilesDB.`);

  if (!db.objectStoreNames.contains("savedFiles")) {
    db.createObjectStore("savedFiles");
  }
};

// When the db is successfully opened, save its reference in a global accessible var,
// and update the UI state.
dbReq.onsuccess = () => {
  db = dbReq.result;

  

  
};

