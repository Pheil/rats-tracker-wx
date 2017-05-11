"use strict";

$('#add').bind('click', function() {
    window.open(chrome.extension.getURL("../popup/add.html"),"_self")
});

function saveRATStoFile(e) {
    var id = e._id;
    var payload = {
      "rats": e.rats,
      "ews": e.ews,
      "week": e.week,
      "desc": e.desc, 
      "hours": e.hours
    };
    var dataObj = {};
    dataObj[id] = payload;
    chrome.storage.local.set(dataObj);
}

$('#log').bind('click', function() {
    var logURL = chrome.extension.getURL("../Log/ratslog.html");
    chrome.tabs.query({}, function(tabs) {
      var doFlag = true;
      for (var i=tabs.length-1; i>=0; i--) {
        if (tabs[i].url == logURL) {
          doFlag = false;
          chrome.tabs.update(tabs[i].id, {active: true}); //focus it
          break;
        }
      }
      if (doFlag) { //it didn't find anything, so create it
        chrome.tabs.create({
            "url": logURL},
                function(tab) {}
        );
        window.close();
      }
    });       
});

$('#entry').bind('click', function() {
    var entryURL = "../entry/rats_entry.html";
    chrome.tabs.query({}, function(tabs) {
      var doFlag = true;
      for (var i=tabs.length-1; i>=0; i--) {
        if (tabs[i].url == entryURL) {
          doFlag = false;
          chrome.tabs.update(tabs[i].id, {active: true}); //focus it
          break;
        }
      }
      if (doFlag) { //it didn't find anything, so create it
        chrome.tabs.create({
            "url": entryURL},
                function(tab) {}
        );
        window.close();
      }
    });       
});

$('#export').bind('click', function() {
    chrome.runtime.sendMessage({"type": "export","msg": "null"});
	window.close();     
});

function getWeekNumber(d) {
    // Copy date so don't modify original
    d = new Date(+d);
    d.setHours(0,0,0);
    // Set to nearest Thursday: current date + 4 - current day number
    // Make Sunday's day number 7
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    // Get first day of year
    var yearStart = new Date(d.getFullYear(),0,1);
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    // Return array of year and week number
    //return [d.getFullYear(), weekNo];
    return weekNo;
}
