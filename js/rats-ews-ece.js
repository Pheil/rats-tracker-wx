//Add Style
    var head = document.getElementsByTagName('head')[0];
    var link2 = document.createElement('link');
        link2.setAttribute('rel', 'stylesheet');
        link2.setAttribute('type', 'text/css');
        link2.setAttribute('href', '../css/style.css');
    head.appendChild(link2);

//Create "add" button
    var div = document.createElement('div');    
    div.setAttribute('id', 'container');
        
    var div_add = document.createElement('div');
        div_add.setAttribute('class', 'floating_add hover-shadow no-print');
        div_add.setAttribute('id', 'add');
        div_add.setAttribute('title', 'Add to RATS');
    div.appendChild(div_add);

//Create hours input
    var hours = document.createElement('input'); 
    hours.setAttribute('id', 'hours');
    hours.setAttribute('class', 'hours');
    hours.setAttribute('type', 'number');
    
    div.appendChild(hours);
    document.body.appendChild(div);
    
    var URLlocation = window.location.href;
    var EWSECE = URLlocation.split('=')[1];
       
    //Add button action
    var add = document.getElementById("add");
    add.addEventListener("click", function() {
        var hours = document.getElementById("hours").value;
        self.port.emit("add", EWSECE, hours);
    }, false);  
    
    //Hour input
    div.addEventListener("mouseover", function() {
         document.getElementById('hours').style.display = 'inline';
         document.getElementById("hours").focus();
         document.getElementById("hours").select();
    }, false);
    
    div.addEventListener("mouseout", function() {
         document.getElementById('hours').style.display = 'none';
         document.getElementById("hours").blur();
    }, false);
    
    self.port.emit("defhour");
    self.port.on("rtnhour", function(hour) {  
        var hourInp = document.getElementById("hours");
        hourInp.setAttribute('value', hour);
    });