// Init local database variable
let db;

// Request new db instance for budget transactions
const request = indexedDB.open('budget', 1);

// Create pending transactions store
request.onupgradeneeded = (e) => {
  // Capture db instance returned by API
  const db = e.target.result;
  const store = db.createObjectStore('pending', { autoIncrement: true });
};

// On successful database instantiation:
request.onsuccess = (e) => {
  // Capture db instance returned by API
  db = e.target.result;

  // If the browser has network connectivity, check real db
  if (navigator.onLine) {
    checkDatabase();
  }
};

// If there's an error creating the indexeddb
request.onerror = (e) => {
  console.log(`Something went wrong! ${e.target.errorCode}`);
}

// Save record to local browser db if network goes down
function saveRecord(record) {
  // Open new transaction with db
  const transaction = db.transaction(["pending"], "readwrite");

  // Access pending transaction store in local db
  const store = transaction.objectStore("pending");

  // Add the record to the pending transaction store
  store.add(record);
}