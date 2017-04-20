function popupMsg(message) {
    if (message.type == "alert") {
        //console.log("background script received message");
        chrome.notifications.create({
            "type": "basic",
            "iconUrl": chrome.extension.getURL("images/icon-64.png"),
            "title": "RATS Tracker",
            "message": message.msg
        });
    } else if (message.type == "badge") {
        var theDate = new Date();
        var endDate = theDate.toJSON();

        //Return start of the week
        var startDate = new Date(theDate.getFullYear(),theDate.getMonth(),theDate.getDate() - (theDate.getDay() + 1)).toJSON();

        //Retrieve all docs
        chrome.storage.local.get(null, function(obj) {
            var weeklyHours = 0; 
            var objKeys = Object.keys(obj);

            if (objKeys.length > 0) {
                for (var i=0;i<objKeys.length;i++) {
                    if (moment(objKeys[i]).isBetween(startDate, endDate)){
                        weeklyHours = parseFloat(weeklyHours) + parseFloat(obj[objKeys[i]].hours)
                    }
                }
            }
            var startDate2 = new Date(startDate);
            var timeDiff = Math.abs(theDate.getTime() - startDate2.getTime());
            var diffHours = (Math.ceil(timeDiff / 3.6e6)-48)*0.3333; //-48 to get mon, *.333 to get 8 hours per day (start date is Sat)
            chrome.browserAction.setBadgeText ( { text: weeklyHours.toString() } );
            if (diffHours - weeklyHours <= 1 && weeklyHours < 40) {
                chrome.browserAction.setBadgeBackgroundColor({color: "#009900"});
            } else if (diffHours - weeklyHours < 8 && diffHours - weeklyHours > 1 && weeklyHours < 40) {
                chrome.browserAction.setBadgeBackgroundColor({color: "#b2b200"});
            } else if (weeklyHours > 40) {
                chrome.browserAction.setBadgeBackgroundColor({color: "#0000ff"});
            } else {
                chrome.browserAction.setBadgeBackgroundColor({color: "#ff0000"});
            }
            
        });
    } else if (message.type == "export") {
        chrome.storage.local.get(null, function(items) { // null implies all items
            // Convert object to a string.
            var result = JSON.stringify(items);

            function onStartedDownload(id) {
              console.log(`Started downloading: ${id}`);
            }

            function onFailed(error) {
              console.log(`Download failed: ${error}`);
            }
            var theDate = Date.parse(new Date());
            //var downloadUrl = 'data:application/json;base64,' + btoa(result);
            var blob = new Blob([result], {
                type: 'data:application/json;base64'
            });
            var url = URL.createObjectURL(blob);
            var downloading = chrome.downloads.download({
              url : url,
              filename : 'RATS_History_' + theDate + '.json',
              conflictAction : 'uniquify'
            });

            downloading.then(onStartedDownload, onFailed);
        });
        



    }

}

/*
Assign `notify()` as a listener to messages from the content script.
*/
chrome.runtime.onMessage.addListener(popupMsg);
