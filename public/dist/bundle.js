/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./public/src/db.js":
/*!**************************!*\
  !*** ./public/src/db.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"saveRecord\": () => (/* binding */ saveRecord)\n/* harmony export */ });\n// Init local database variable\nvar db; // Request new db instance for budget transactions\n\nvar request = indexedDB.open('budget', 1); // Create pending transactions store\n\nrequest.onupgradeneeded = function (e) {\n  // Capture db instance returned by API\n  var db = e.target.result;\n  var store = db.createObjectStore('pending', {\n    autoIncrement: true\n  });\n}; // On successful database instantiation:\n\n\nrequest.onsuccess = function (e) {\n  // Capture db instance returned by API\n  db = e.target.result; // If the browser has network connectivity, check real db\n\n  if (navigator.onLine) {\n    checkDatabase();\n  }\n}; // If there's an error creating the indexeddb\n\n\nrequest.onerror = function (e) {\n  console.log(\"Something went wrong! \".concat(e.target.errorCode));\n}; // Save record to local browser db if network goes down\n\n\nfunction saveRecord(record) {\n  // Open new transaction with local db\n  var transaction = db.transaction(['pending'], 'readwrite'); // Access pending transaction store in local db\n\n  var store = transaction.objectStore('pending'); // Add the record to the pending transaction store\n\n  store.add(record);\n}\n\nfunction checkDatabase() {\n  // Open new transaction with local db\n  var transaction = db.transaction(['pending'], 'readwrite'); // Access pending transaction store in local db\n\n  var store = transaction.objectStore('pending'); // Get all pending transactions for a bulk transaction with real db\n\n  var allPending = store.getAll(); // If all pending transactions are retrieved successfully\n\n  allPending.onsuccess = function () {\n    // If there are local transactions, send all of them back to API\n    if (allPending.result.length > 0) {\n      fetch('/api/transaction/bulk', {\n        method: 'POST',\n        body: JSON.stringify(allPending.result),\n        headers: {\n          Accept: 'application/json, text/plain, */*',\n          'Content-Type': 'application/json'\n        }\n      }).then(function (response) {\n        return response.json();\n      }).then(function () {\n        // Open a new transaction with pending transactions store\n        var transaction = db.transaction(['pending'], 'readwrite');\n        var store = transaction.objectStore('pending'); // Clear transactions from local db once network comes back online\n\n        store.clear();\n      });\n    }\n  };\n} // Listen to browser for network to come back online\n\n\nwindow.addEventListener('online', checkDatabase);\n\n\n//# sourceURL=webpack://budget-app/./public/src/db.js?");

/***/ }),

/***/ "./public/src/index.js":
/*!*****************************!*\
  !*** ./public/src/index.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ \"./public/src/db.js\");\n // Init global variables\n\nvar transactions = [];\nvar myChart; // Get all transactions from database\n\nfetch(\"/api/transaction\").then(function (response) {\n  return response.json();\n}).then(function (data) {\n  // Push transactions into local array for local storage\n  transactions = data; // Render visuals\n\n  populateTotal();\n  populateTable();\n  populateChart();\n});\n\nfunction populateTotal() {\n  // reduce transaction amounts to a single total value\n  var total = transactions.reduce(function (total, t) {\n    return total + parseInt(t.value);\n  }, 0);\n  var totalEl = document.querySelector(\"#total\");\n  totalEl.textContent = total;\n}\n\nfunction populateTable() {\n  var tbody = document.querySelector(\"#tbody\");\n  tbody.innerHTML = \"\";\n  transactions.forEach(function (transaction) {\n    // create and populate a table row\n    var tr = document.createElement(\"tr\");\n    tr.innerHTML = \"\\n      <td>\".concat(transaction.name, \"</td>\\n      <td>\").concat(transaction.value, \"</td>\\n    \");\n    tbody.appendChild(tr);\n  });\n}\n\nfunction populateChart() {\n  // copy array and reverse it\n  var reversed = transactions.slice().reverse();\n  var sum = 0; // create date labels for chart\n\n  var labels = reversed.map(function (t) {\n    var date = new Date(t.date);\n    return \"\".concat(date.getMonth() + 1, \"/\").concat(date.getDate(), \"/\").concat(date.getFullYear());\n  }); // create incremental values for chart\n\n  var data = reversed.map(function (t) {\n    sum += parseInt(t.value);\n    return sum;\n  }); // remove old chart if it exists\n\n  if (myChart) {\n    myChart.destroy();\n  }\n\n  var ctx = document.getElementById(\"myChart\").getContext(\"2d\");\n  myChart = new Chart(ctx, {\n    type: 'line',\n    data: {\n      labels: labels,\n      datasets: [{\n        label: \"Total Over Time\",\n        fill: true,\n        backgroundColor: \"#6666ff\",\n        data: data\n      }]\n    }\n  });\n} // Send new transactions through API to database\n\n\nfunction sendTransaction(isAdding) {\n  var nameEl = document.querySelector(\"#t-name\");\n  var amountEl = document.querySelector(\"#t-amount\");\n  var errorEl = document.querySelector(\".form .error\"); // validate form\n\n  if (nameEl.value === \"\" || amountEl.value === \"\") {\n    errorEl.textContent = \"Missing Information\";\n    return;\n  } else {\n    errorEl.textContent = \"\";\n  } // create record\n\n\n  var transaction = {\n    name: nameEl.value,\n    value: amountEl.value,\n    date: new Date().toISOString()\n  }; // if subtracting funds, convert amount to negative number\n\n  if (!isAdding) {\n    transaction.value *= -1;\n  } // add to beginning of current array of data\n\n\n  transactions.unshift(transaction); // re-run logic to populate ui with new record\n\n  populateChart();\n  populateTable();\n  populateTotal(); // also send to server\n\n  fetch(\"/api/transaction\", {\n    method: \"POST\",\n    body: JSON.stringify(transaction),\n    headers: {\n      Accept: \"application/json, text/plain, */*\",\n      \"Content-Type\": \"application/json\"\n    }\n  }).then(function (response) {\n    return response.json();\n  }).then(function (data) {\n    if (data.errors) {\n      errorEl.textContent = \"Missing Information\";\n    } else {\n      // clear form\n      nameEl.value = \"\";\n      amountEl.value = \"\";\n    }\n  })[\"catch\"](function (err) {\n    // fetch failed, so save in indexed db\n    (0,_db__WEBPACK_IMPORTED_MODULE_0__.saveRecord)(transaction); // clear form\n\n    nameEl.value = \"\";\n    amountEl.value = \"\";\n  });\n} // New Transaction: Add money\n\n\ndocument.querySelector(\"#add-btn\").onclick = function () {\n  sendTransaction(true);\n}; // New Transaction: Subtract money\n\n\ndocument.querySelector(\"#sub-btn\").onclick = function () {\n  sendTransaction(false);\n};\n\n//# sourceURL=webpack://budget-app/./public/src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./public/src/index.js");
/******/ 	
/******/ })()
;