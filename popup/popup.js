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
	

	//window.close();     
});

$('#save').bind('click', function() {
	//Nothing yet
	window.close();     
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