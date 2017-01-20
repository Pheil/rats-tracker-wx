/*
Feature detection
 */
// DON'T use "var indexedDB = ..." if you're not in a function.
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

/*
requestError
 */
function requestError() {
    alert('IndexedDB request denied');
}

/*
dbError message from event
 */
function dbError(event) {
    alert('Database error: ' + event.target.errorCode);
}

/*
notesApp
 */
function notesApp(event) {
    this.db = event.target.result;
    this.db.onerror = dbError;
}

var request = window.indexedDB.open("MyNotes", 1);
request.onerror = requestError;
request.onsuccess = notesApp;