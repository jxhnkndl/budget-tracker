// Init local database variable
let db;

// Request new database instance for budget transactions
const request = indexedDB.open("budget", 1);

// Create pending transactions store
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  const store = db.createObjectStore("pending", { autoIncrement: true });
} 

request.onsuccess = (e) => {
  db = e.target.result;
  console.log(db);
}