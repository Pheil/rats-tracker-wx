/*
Log that we received the message.
Then display a notification. The notification contains the URL,
which we read from the message.
*/
/* function notify(message) {
    //console.log("background script received message");
    browser.notifications.create({
        "type": "basic",
        "iconUrl": chrome.extension.getURL("images/icon-64.png"),
        "title": "RATS Tracker",
        "message": message.msg
    });
} */

function popupMsg(message) {
    if (message.type == "alert") {
        //console.log("background script received message");
        chrome.notifications.create({
            "type": "basic",
            "iconUrl": chrome.extension.getURL("images/icon-64.png"),
            "title": "RATS Tracker",
            "message": message.msg
        });
    } else if (message.type == "DB") {
        console.log(message.msg);
        var db = new PouchDB('RATS');
        db.put(doc);
    }

}

/*
Assign `notify()` as a listener to messages from the content script.
*/
chrome.runtime.onMessage.addListener(popupMsg);

