"use strict";
$('#rats').focus().select();

$('#back').bind('click', function() {
    window.open(chrome.extension.getURL("../popup/popup.html"),"_self")
});

$('#save').bind('click', function() {
    var ews = document.getElementById("ews").value,
        rats = document.getElementById("rats").value,
        desc = document.getElementById("desc").value,
        hours = document.getElementById("hour").value;
    if (ews === "") {
        ews = "N/A";
    }
    
    if (hours<=0) {
        chrome.runtime.sendMessage({"type": "alert","msg": "Invalid hours, must be a number and greater than 0."});
    } else {
        var theDate = new Date();
        var doc = {
          "_id": new Date().toJSON(),
          "rats": rats,
          "ews": ews,
          "week": getWeekNumber(theDate),
          "desc": desc, 
          "hours": hours
        };
        saveRATStoFile(doc);
        //CLOSE PANEL?
        if (ews == "N/A") {
            chrome.runtime.sendMessage({"type": "alert","msg": "Job " + desc + " [" + hours + " hours] added to RATS log."});
        } else {
            chrome.runtime.sendMessage({"type": "alert","msg": "Job EWS" + ews + " [" + hours + " hours] added to RATS log."});
        }
        chrome.runtime.sendMessage({"type": "badge","msg": "null"});
        }
    //window.close();     
});
//window.close(); 

var rats = new Bloodhound({
  //datumTokenizer: Bloodhound.tokenizers.obj.whitespace('ratn'),
  datumTokenizer: function(d){
        var tokens = [];
        //the available string is 'ratn' in your datum
        var stringSize = d.ratn.length;
        //multiple combinations for every available size
        //(eg. dog = d, o, g, do, og, dog)
        for (var size = 1; size <= stringSize; size++){          
          for (var i = 0; i+size<= stringSize; i++){
              tokens.push(d.ratn.substr(i, size));
          }
        }

        return tokens;
    },
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  prefetch: {
    url: 'rats.json',
    cache: true,
    ttl: 604800000
  }
});

$('#suggestions .typeahead').typeahead(null, {
  name: 'rats-list',
  display: 'ratn',
  hint: true,
  highlight: true,
  minLength: 0,
  source: rats,
  limit: 250,
  templates: {
    empty: [
      'Unable to find matches.'
    ].join('\n'),
    suggestion: function (data) {
        return '<p><strong>' + data.ratn + '</strong> - ' + data.desc + '</p>';
    }
  }
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