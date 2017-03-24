//document.addEventListener("DOMContentLoaded", function(n) {
    //TgTableSort("rats-log");
//});

function closeInput() {
    var td = this.parentNode;
    var value = this.value;
    td.removeChild(this);
    td.textContent = value;
    //Current values
    var row = document.getElementById(td.parentNode.id),
        cell = row.getElementsByTagName("td"),
        rats = cell[1].textContent,
        ews = cell[2].textContent,
        week = cell[3].textContent,
        desc = cell[4].textContent,
        hours = cell[5].textContent,
        ID = td.parentNode.id;
    
    //Update changed value
    if (td.id == "D") {
        desc = this.value;
    } else if (td.id == "H") {
        hours = this.value;
    } else if (td.id == "R") {
        rats = this.value;
    } else if (td.id == "E") {
        ews = this.value;
    } else if (td.id == "W") {
        week = this.value;
    }
    var doc = {
      "_id": ID,
      "rats": rats,
      "ews": ews,
      "week": week,
      "desc": desc, 
      "hours": hours
    };
    saveRATStoFile(doc,value);
}

function saveRATStoFile(e,newData) {
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
    chrome.storage.local.set(dataObj, function() {
          console.log('Record updated to "' + newData + '"');
          chrome.runtime.sendMessage({"type": "badge","msg": "null"});
    });
    
}

function addInput() {
    if (this.getElementsByTagName('input').length > 0) return;

    var value = this.innerHTML;
    this.innerHTML = '';

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'update');
    input.setAttribute('value', value);
    this.appendChild(input);
    input.focus();
    
    input = document.querySelectorAll("input[type=text]");
    Array.prototype.forEach.call(input, function(input) {
      input.addEventListener('blur', closeInput);
    }); 
}

chrome.storage.local.get(null, function(obj) {
    //console.log(obj);
    //console.log(Object.values(obj));
    //var objKeys = Object.keys(obj);
    //console.log(objKeys.length);
    //console.log(objKeys[0]);
    var row = 0;
    for (const [key, val] of Object.entries(obj)) {
        const val = obj[key];
        //Separate into variables
            row = row+1;
            var id  = key,
                rats  = val.rats,
                ews  = val.ews,
                week  = val.week,
                desc  = val.desc,
                hours  = val.hours,
                table = document.getElementById('rats-log'),
                BackgroundRED = '',
                BackgroundBLUE = '';
            
            function isEven(n) 
            {
               return n % 2 == 0;
            }
            function isOdd(n)
            {
               return Math.abs(n) % 2 == 1;
            }
            //var theDate = new Date(id);
            if (isEven(Number(week))) {
                BackgroundRED = Number(week)+100;
                BackgroundBLUE = Number(week)+100;
                //var c = theDate.getMonth()*0.05;
            }
            if (isOdd(Number(week))) {
                BackgroundRED = Number(week)+200;
                BackgroundBLUE = Number(week)+200;
                //var c = theDate.getMonth()*0.1;
            }
                
            var newRow   = table.insertRow(row+1);
            newRow.setAttribute("style", "background-color:rgba(" + BackgroundRED + ",240," + BackgroundBLUE + ",.6);");
            newRow.setAttribute("id", id);
            var newCell_1  = newRow.insertCell(0);
            var newText_1  = document.createTextNode(id);
            newCell_1.appendChild(newText_1);
            
            var newCell_2  = newRow.insertCell(1);
            newCell_2.setAttribute("id", "R");
            var newText_2  = document.createTextNode(rats);
            newCell_2.appendChild(newText_2);
            
            var newCell_3  = newRow.insertCell(2);
            newCell_3.setAttribute("id", "E");
            var newText_3  = document.createTextNode(ews);
            newCell_3.appendChild(newText_3);
            
            var newCell_4  = newRow.insertCell(3);
            newCell_4.setAttribute("id", "W");
            var newText_4  = document.createTextNode(week);
            newCell_4.appendChild(newText_4);
            
            var newCell_5  = newRow.insertCell(4);
            newCell_5.setAttribute("id", "D");
            var newText_5  = document.createTextNode(desc);
            newCell_5.appendChild(newText_5);
            
            var newCell_6  = newRow.insertCell(5);
            newCell_6.setAttribute("id", "H");
            var newText_6  = document.createTextNode(hours);
            newCell_6.appendChild(newText_6);            
            
            // using a CSS Selector, with document.querySelectorAll()
            // to get a NodeList of <td> elements within the #tableID element:
            var cells = document.querySelectorAll('#rats-log td');

            // iterating over the array-like NodeList, using
            // Array.prototype.forEach() and Function.prototype.call():
            Array.prototype.forEach.call(cells, function(td) {
              // the first argument of the anonymous function (here: 'td')
              // is the element of the array over which we're iterating.

              // adding an event-handler (the function logText) to handle
              // the click events on the <td> elements:
              td.addEventListener('dblclick', addInput);
            }); 
    }
});
