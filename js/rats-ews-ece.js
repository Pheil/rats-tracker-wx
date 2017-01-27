//Create "add" button
    var a = document.createElement('a');    
        a.setAttribute('class', 'btn-floating no-print');
        a.setAttribute('draggable', 'true');
        
    var div_i = document.createElement('i');
        div_i.setAttribute('id', 'add');
        div_i.textContent = "+";
        div_i.setAttribute('title', 'Add to RATS');
    a.appendChild(div_i);

//Create hours input
    var hours = document.createElement('input'); 
        hours.setAttribute('id', 'hours');
        hours.setAttribute('class', 'hours');
        hours.setAttribute('type', 'number'); 
    a.appendChild(hours);
    
//Create empty bubble
    var div = document.createElement('div');
        div.setAttribute('id', 'empt');
    a.appendChild(div);
    
    document.body.appendChild(a);

    var URLlocation = window.location.href;
    var EWSECE = URLlocation.split('=')[1];
    var rats = "";
    var theDate = new Date();
    
    //Determine which page visited
    //Elastomer EWS
    var ews_chk = URLlocation.indexOf("in_ewr_");
    
    //Elastomer ECE
    var ece_chk = URLlocation.indexOf("in_ece_");
    
    //RC Work order
    var wo_chk = URLlocation.indexOf("in_wo_");
    
    if (ews_chk > -1){
        //Remove 'EWS'
        var n = EWSECE.indexOf("EWS"); 
        if (n < -1){
            EWSECE = "EWS" + EWSECE;
        }
    } else if (ece_chk > -1) {
        //Grab ECE number from webpage
        EWSECE = document.querySelector("body > font:nth-child(2) > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2) > font:nth-child(1) > p:nth-child(1) > b:nth-child(1)").textContent;
    } else if (wo_chk > -1) {
        //Grab WO number from webpage
        EWSECE = "WO" + document.querySelector("table.no14:nth-child(2) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)").textContent;
        //Grab RATS #
        rats = document.querySelector(".four14 > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(6) > a:nth-child(3)").textContent;
    }
       
    //Add button action
    var add = document.getElementById("add");
    add.addEventListener("click", function() {
        var hours = document.getElementById("hours").value;
        var id = new Date().toJSON();
        var payload = {
          "rats": rats,
          "ews": EWSECE,
          "week": getWeekNumber(theDate),
          "desc": "", 
          "hours": hours
        };
        var dataObj = {};
        dataObj[id] = payload;
        chrome.storage.local.set(dataObj, function() {
              console.log('Record saved');
              browser.runtime.sendMessage({"type": "alert","msg": "Job " + EWSECE + " [" + hours + " hours] added to RATS log."});
              chrome.runtime.sendMessage({"type": "badge","msg": "null"});
            });
        }, false);  
    
    //Hour input
    a.addEventListener("mouseover", function() {
         document.getElementById('hours').style.display = 'inline';
         document.getElementById('empt').style.display = 'inline';
         document.getElementById("hours").focus();
         document.getElementById("hours").select();
    }, false);
    
    a.addEventListener("mouseout", function() {
         document.getElementById('hours').style.display = 'none';
         document.getElementById('empt').style.display = 'none';
         document.getElementById("hours").blur();
    }, false);
    
    chrome.storage.local.get({
        myHour: ''
    }, function(items) {
        var myHour = items.myHour;
        var hourInp = document.getElementById("hours");
        hourInp.setAttribute('value', myHour);
        hourInp.value = myHour;
    });
    
function getWeekNumber(d) {
    d = new Date(+d);
    d.setHours(0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    var yearStart = new Date(d.getFullYear(),0,1);
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}