var selected,
    selectCell = function (e) {
        var cell = e.target,
            range, selection;
        if (cell.tagName.toLowerCase() !== 'td') {
            while (cell == cell.parentElement) {
                if (cell.tagName.toLowerCase() === 'td') {
                    break;
                }               
            }
        }
        if (!cell || cell.tagName.toLowerCase() !== 'td') {
            return;
        }
        if (selected) {
            selected.style.backgroundColor = '';            
        }
        cell.style.backgroundColor = '#ff0';
        selected = cell;
    },
    afterCopyCell = function (e) {
        if (!selected || !e.ctrlKey || e.which !== 67) {
            return;
        }
        selection = window.getSelection();
        selection.removeAllRanges();
    },
table = document.getElementById('rats-log');
table.addEventListener('click', selectCell);
document.body.addEventListener('keyup', afterCopyCell);


function logText() {
  // 'this' is automatically passed to the named
  // function via the use of addEventListener()
  // (later):
    var succeeded;
    try {
        SelectText(this.id);
        // Copy it to the clipboard
        succeeded = document.execCommand("copy");
    } catch (e) {
        succeeded = false;
    }
    if (succeeded) {
        //console.log("Copy successful!");
    } else {
        //console.log("Copy failed :(");
    }
}

function SelectText(element) {
    var doc = document;
    var text = doc.getElementById(element);    
    if (doc.body.createTextRange) { // ms
        var range = doc.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = doc.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

$(function() {
    $( "#from" ).datepicker({
      defaultDate: "-1m",
      dateFormat: "yy-mm-dd",
      showWeek: true,
      changeMonth: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#to" ).datepicker( "option", "minDate", selectedDate );
      }
    });
    $("#from").datepicker("setDate", "-4w");

    $( "#to" ).datepicker({
      defaultDate: "+0w",
      dateFormat: "yy-mm-dd",
      showWeek: true,
      changeMonth: true,
      numberOfMonths: 1,
      onClose: function( selectedDate ) {
        $( "#from" ).datepicker( "option", "maxDate", selectedDate );
      }
    });
    $("#to").datepicker("setDate", "+0");
    updateRecords();
});



//Sidebar loaded so retrieve and display baseline data
//var fromDate = $( "#from" ).datepicker( "getDate" );
//addon.port.emit("loaded");
//addon.port.on("update", function(array) {
    //var fromDate = $("#from").val(); //Formatted date
    //var fromDate = $( "#from" ).datepicker( "getDate" ); //full date
    //var toDate = $( "#to" ).datepicker( "getDate" ); 
function updateRecords() {
    $("#rats-log > tbody > tr").remove();
    var startDate = new Date($( "#from" ).datepicker( "getDate" ));
    var endDate = new Date($( "#to" ).datepicker( "getDate" ));
        endDate.setHours(23,59,59,999);
    chrome.storage.local.get(null, function(obj) {
        var objKeys = Object.keys(obj);
        
        if (objKeys.length > 0) {
            var row = 0;
            for (const [key, val] of Object.entries(obj)) {
                //var theDate = new Date();
                //var endDate = theDate.toJSON();
                //var lastMms = theDate.getTime() - (1000*60*60*24*28); // Offset by 4w - 28 days;
                //theDate.setTime( lastMms );
                //var startDate = new Date(theDate.getFullYear(),theDate.getMonth(),theDate.getDate()).toJSON();
                
                const val = obj[key];
                //Separate into variables
                row = row+1;
                var id  = key;
                var rats  = val.rats || "-";
                var ews  = val.ews || "-";
                var week  = val.week;
                var desc  = val.desc || "None";
                var hours  = val.hours || 0;
                var table = document.getElementById('rats-log-tbody');
                //Type of job
                var jtype = "";
                var n_ews = ews.indexOf("EWS"); 
                var n_ece = ews.indexOf("ECE"); 
                var n_wo = ews.indexOf("WO"); 
                if (n_ews > -1){
                    jtype = "EWS";
                    ews = ews.slice(3);
                } else if (n_ece > -1) {
                    jtype = "ECE";
                } else if (n_wo > -1) {
                    
                    console.log(ews);
                    jtype = "WO";
                    //ews = ews.slice(2);
                } else {
                    jtype = "N/A";
                }
                
                function addRow() {
                    //Add data from array to table
                    var newRow   = table.insertRow(0);
                    var newCell_0  = newRow.insertCell(0);
                    var newText_0  = document.createTextNode(rats);
                    newCell_0.appendChild(newText_0);
                    newCell_0.setAttribute('id', rats);
                    
                    var newCell_1  = newRow.insertCell(1);
                    var newText_1  = document.createTextNode(jtype);
                    newCell_1.appendChild(newText_1);
                    newCell_1.setAttribute('id', row);
                    
                    var newCell_2  = newRow.insertCell(2);
                    var newText_2  = document.createTextNode(ews);
                    newCell_2.appendChild(newText_2);
                    newCell_2.setAttribute('id', ews);
                    
                    var newCell_3  = newRow.insertCell(3);
                    var newText_3  = document.createTextNode(week);
                    newCell_3.appendChild(newText_3);
                    
                    var newCell_4  = newRow.insertCell(4);
                    var newText_4  = document.createTextNode(desc);
                    newCell_4.appendChild(newText_4);
                    newCell_4.setAttribute('id', desc + ews);
                    
                    var newCell_5  = newRow.insertCell(5);
                    var newText_5  = document.createTextNode(hours);
                    newCell_5.appendChild(newText_5);
                    newCell_5.setAttribute('id', hours + ews);
                }    
                //Check if ews already exists in table
                //to do:  change week to "m" if combining different weeks
                //don't add two with N/A
                var exists = false;
                var upRow;
                var mul_wk;
                if (ews != "N/A") {
                    //var upRow;
                    var rows = table.getElementsByTagName('tr').length;
                    //for (var curRow=rows; curRow >= 0; curRow--) {
                    for (i = 0; i < rows; i++) {
                        var curEWS = table.rows[i].cells[2].textContent;
                        mul_wk = table.rows[i].cells[3].textContent;
                        if (curEWS == ews) {
                            exists = true;
                            upRow = i;
                            break;
                        } else {
                        }
                    }
                }
                
                if (exists === true) {
                    if (moment(key).isBetween(startDate, endDate)){
                        if (table.rows[upRow].cells[3].textContent != week) {
                            table.rows[upRow].cells[3].textContent = table.rows[upRow].cells[3].textContent + "/" + week;
                        }
                        table.rows[upRow].cells[5].textContent = parseInt(table.rows[upRow].cells[5].textContent) + parseInt(hours);
                    }

                } else {
                    if (moment(key).isBetween(startDate, endDate)){
                        addRow();
                    }
                }
                    
                // using a CSS Selector, with document.querySelectorAll() to get a NodeList of <td> elements within the #tableID element:
                var cells = document.querySelectorAll('#rats-log td');

                // iterating over the array-like NodeList, using Array.prototype.forEach() and Function.prototype.call():
                Array.prototype.forEach.call(cells, function(td) {
                  // the first argument of the anonymous function (here: 'td') is the element of the array over which we're iterating.

                  // adding an event-handler (the function logText) to handle the click events on the <td> elements:
                  td.addEventListener('click', logText);
                });  
            }
        }
    });
}
    
$("#from").datepicker({
  onSelect: function(dateText) {
    $('#to').datepicker('option', 'minDate', $("#from").datepicker("getDate"));
    updateRecords();
  }
});
$("#to").datepicker({
  onSelect: function(dateText) {
    $('#from').datepicker('option', 'maxDate', $("#to").datepicker("getDate"));
    updateRecords();
  }
});