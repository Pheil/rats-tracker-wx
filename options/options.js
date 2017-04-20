// Saves options to chrome.storage.sync.
function save_options() {
  var myHour = document.getElementById('defHour').value;
  chrome.storage.local.set({
    myHour: myHour
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
		status.textContent = 'Options saved.';
    setTimeout(function() {
		status.textContent = '';
    }, 1050);
  });
}

// Restores state using the preferences stored in chrome.storage.
// function restore_options() {

  // chrome.storage.local.get({
    // myHour: 1
  // }, function(items) {
    // document.getElementById('defHour').value = items.myHour;
  // });
// }

function restore_options() {
  var gettingItem = chrome.storage.local.get('myHour');
  gettingItem.then((res) => {
    document.querySelector("#defHour").value = res.myHour || "1";
  });
}
// Restores state using the preferences stored in chrome.storage.
function reset_options() {
    document.getElementById('defHour').value = "1";
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options reset.';
    setTimeout(function() {
      status.textContent = '';
    }, 1050);
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
document.getElementById('reset').addEventListener('click', reset_options);