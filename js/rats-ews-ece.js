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
    var theDate = new Date();
    
    //Remove 'EWS'
    var n = EWSECE.indexOf("EWS"); 
    if (n > -1){
        EWSECE = EWSECE.substr(3, 7);
    }
           
    //Add button action
    var add = document.getElementById("add");
    add.addEventListener("click", function() {
        var hours = document.getElementById("hours").value;
        var id = new Date().toJSON();
        var payload = {
          "rats": "",
          "ews": EWSECE,
          "week": getWeekNumber(theDate),
          "desc": "", 
          "hours": hours
        };
        var dataObj = {};
        dataObj[id] = payload;
        chrome.storage.local.set(dataObj, function() {
              console.log('Record saved');
              browser.runtime.sendMessage({"type": "alert","msg": "Job EWS" + EWSECE + " [" + hours + " hours] added to RATS log."});
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
        console.log("test:" + myHour);
    });
    
function getWeekNumber(d) {
    d = new Date(+d);
    d.setHours(0,0,0);
    d.setDate(d.getDate() + 4 - (d.getDay()||7));
    var yearStart = new Date(d.getFullYear(),0,1);
    var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
    return weekNo;
}