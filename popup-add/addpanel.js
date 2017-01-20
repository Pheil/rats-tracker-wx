self.port.on("show", function onShow() {    
    $('#ews').focus();
    $('#ews').select();
});

var hours = document.getElementById("hours");
hours.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField (e) {
    if (e.keyCode === 13) {
        addData();
        return e.returnValue = false;
    }
}

var add = document.getElementById("add");
add.addEventListener("click", addData, false);

function addData () {
    var ews = document.getElementById("ews").value;
    var rats = document.getElementById("rats").value;
    var desc = document.getElementById("desc").value;
    var hours = document.getElementById("hours").value;
    if (isNaN(hours) || hours <=0) {
        hours = 0;
        self.port.emit('man_add', ews, rats, desc, hours);
    } else {
        self.port.emit('man_add', ews, rats, desc, hours);
    }
}



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
    url: './js/rats.json',
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
      '<div class="empty-message">',
        'Unable to find any rats numbers that match query',
      '</div>'
    ].join('\n'),
    suggestion: function (data) {
        return '<p><strong>' + data.ratn + '</strong> - ' + data.desc + '</p>';
    }
  }
});