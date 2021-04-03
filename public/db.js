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
};

// Save record to local browser db if network goes down
function saveRecord(record) {
  // Open new transaction with local db
  const transaction = db.transaction(['pending'], 'readwrite');

  // Access pending transaction store in local db
  const store = transaction.objectStore('pending');

  // Add the record to the pending transaction store
  store.add(record);
}

function checkDatabase() {
  // Open new transaction with local db
  const transaction = db.transaction(['pending'], 'readwrite');

  // Access pending transaction store in local db
  const store = transaction.objectStore('pending');

  // Get all pending transactions for a bulk transaction with real db
  const allPending = store.getAll();

  // If all pending transactions are retrieved successfully
  allPending.onsuccess = () => {
    // If there are local transactions, send all of them back to API
    if (allPending.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(allPending.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then(() => {
          // Open a new transaction with pending transactions store
          const transaction = db.transaction(['pending'], 'readwrite');
          const store = transaction.objectStore('pending');

          // Clear transactions from local db once network comes back online
          store.clear();
        });
    }
  };
}

// Listen to browser for network to come back online
window.addEventListener('online', checkDatabase);
