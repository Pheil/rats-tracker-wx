"use strict";
//var db = new PouchDB('RATS');

$('#add').bind('click', function() {
	//var test = document.getElementById('addBlock')
	var log = document.getElementById('2');
	if (!document.getElementById('addBlock')) {
		//Move view log down
		log.setAttribute('style', 'margin-top:68px;');
		
		var div = document.createElement("div");
			div.id = "addBlock";
		var _id = document.createElement("input");
			_id.setAttribute('type', 'hidden');
			_id.id = "_id";
		var ews = document.createElement("input");
			ews.setAttribute('type', 'text');
			ews.setAttribute('placeholder', 'EWS');
			ews.id = "ews";
		var rats = document.createElement("input");
			rats.setAttribute('type', 'text');
			rats.setAttribute('placeholder', 'RATS');
			rats.id = "rats";
		var desc = document.createElement("input");
			desc.setAttribute('type', 'text');
			desc.setAttribute('placeholder', 'Description');
			desc.id = "desc";
		var hour = document.createElement("input");
			hour.setAttribute('type', 'number');
			hour.id = "hour";
		var save = document.createElement("div");
			save.setAttribute('class', 'panel-section panel-section-footer-small');
			save.innerHTML = "<div class='panel-section-footer-button-small' id='save'><i class='save button2'></i>Save<span class='text-shortcut'></span></div>";
		div.appendChild(_id);
		div.appendChild(hour);
		div.appendChild(ews);
		div.appendChild(rats);
		div.appendChild(desc);
		div.appendChild(save);
			
		var add = document.getElementById('1');
			add.appendChild(div);
		document.getElementById("addBlock").style.display = "block";
	} else if (document.getElementById("addBlock").style.display == "block") {
		document.getElementById("addBlock").style.display = "none";
		log.setAttribute('style', 'margin-top:0;');
	} else {
		document.getElementById("addBlock").style.display = "block";
		log.setAttribute('style', 'margin-top:69px;');
	}
	
    //Bind for save button needs to be after it is created
    $('#save').bind('click', function() {
        //TESTING CODE
        var ews = document.getElementById("ews").value,
            rats = document.getElementById("rats").value,
            desc = document.getElementById("desc").value,
            hours = document.getElementById("hour").value;
        if (ews === "") {
            ews = "N/A";
        }
        
        if (hours<=0) {
            browser.runtime.sendMessage({"type": "alert","msg": "Invalid hours, must be a number and greater than 0."});
        } else {
            var theDate = new Date();
            //var db = new PouchDB('RATS');
            var doc = {
              "_id": new Date().toJSON(),
              "rats": rats,
              "ews": ews,
              "week": getWeekNumber(theDate),
              "desc": desc, 
              "hours": hours
            };
            //db.put(doc);
            chrome.runtime.sendMessage({"type": "DB","msg": doc});
            //CLOSE PANEL?
            if (ews == "N/A") {
                chrome.runtime.sendMessage({"type": "alert","msg": "Job " + desc + " [" + hours + " hours] added to RATS log."});
            } else {
                chrome.runtime.sendMessage({"type": "alert","msg": "Job EWS" + ews + " [" + hours + " hours] added to RATS log."});
            }
            //Might need to do this in background.
            //updateBadge();
            }
        //TESTING CODE
        //window.close();     
    });
	//window.close();     
});



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
	//Nothing yet
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
function updateBadge() {
    var theDate = new Date();
    var theDate2 = theDate.toJSON();
    //var week = getWeekNumber(theDate);

    //Return start of the week
    var startDate = new Date(theDate.getFullYear(),theDate.getMonth(),theDate.getDate() - (theDate.getDay() + 1)).toJSON();

    //Retrieve all docs with same week and year
    var db = new PouchDB('RATS');
    var options = {startkey : startDate, endkey : theDate2, include_docs : true};
    var weeklyHours = 0;
    db.allDocs(options, function (err, response) {
        if (response && response.rows.length > 0) {
          //Separate into variables
            for (var i=0;i<response.rows.length;i++) {
                var rat_data = JSON.stringify(response.rows[i].doc);
                var rat_data_parsed = JSON.parse(rat_data);
                //var num = i;
                weeklyHours = weeklyHours + Number(rat_data_parsed.hours);
            }
        }
        //Update badge
        var startDate2 = new Date(startDate);
        var timeDiff = Math.abs(theDate.getTime() - startDate2.getTime());
        var diffHours = (Math.ceil(timeDiff / 3.6e6)-48)*0.3333; //-48 to get mon, *.333 to get 8 hours per day (start date is Sat)
        //rats_button.badge = weeklyHours;
        //Update Badge
        chrome.browserAction.setBadgeText ( { text: weeklyHours } );
        if (diffHours - weeklyHours <= 1) {
            //rats_button.badgeColor = "#009900";
            browser.browserAction.setBadgeBackgroundColor({color: "#009900"});
        } else if (diffHours - weeklyHours < 8 && diffHours - weeklyHours > 1) {
            //rats_button.badgeColor = "#b2b200";
            browser.browserAction.setBadgeBackgroundColor({color: "#b2b200"});
        } else {
            //rats_button.badgeColor = "#ff0000";
            browser.browserAction.setBadgeBackgroundColor({color: "#ff0000"});
        }

      // handle err or response
    });
}