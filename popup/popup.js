"use strict";

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
			ews.setAttribute('placeholder', '#####');
            ews.setAttribute('title', 'EWS,  ECE, or WO Number');
			ews.id = "ews";
        var rats_div = document.createElement("div");
			rats_div.setAttribute('id', 'suggestions');
		var rats_i = document.createElement("input");
			rats_i.setAttribute('type', 'text');
			rats_i.setAttribute('placeholder', 'E10000#');
			rats_i.setAttribute('id', 'rats');
			rats_i.setAttribute('class', 'typeahead');
            rats_i.setAttribute('title', '10 or 11 digit RATS Number');
			rats_i.id = "rats";
        rats_div.appendChild(rats_i);
    
		var desc = document.createElement("input");
			desc.setAttribute('type', 'text');
			desc.setAttribute('placeholder', 'Description');
            desc.setAttribute('title', 'Additional job details.');
			desc.id = "desc";
		var hour = document.createElement("input");
			hour.setAttribute('type', 'number');
            hour.setAttribute('title', 'Hours');
            hour.setAttribute('value', 0);
			hour.id = "hour";
		var save = document.createElement("div");
			save.setAttribute('class', 'panel-section panel-section-footer-small');
			save.innerHTML = "<div class='panel-section-footer-button-small' id='save'><i class='save button2'></i><span class='save-text '>Save</span></div>";
		div.appendChild(_id);
		div.appendChild(hour);
		div.appendChild(ews);
		div.appendChild(rats_div);
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
    
    $('#hour').focus().select();
	
    //Bind for save button needs to be after it is created
    $('#save').bind('click', function() {
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
    browser.runtime.sendMessage({"type": "export","msg": "null"});
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
