var fs = require('fs');
var path = require("path");
// var input_path = path.join(__dirname, "../products/virtual-maths-camp/development/idems-vmc.json");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var json_string = fs.readFileSync(input_path).toString();

var obj = JSON.parse(json_string);



obj.flows.sort(function(a, b){
    var x = a.name.toLowerCase();
    var y = b.name.toLowerCase();
    if (x < y) {return -1;}
    if (x > y) {return 1;}
    return 0;
  }); 

new_flows = JSON.stringify(obj, null, 2);
var output_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_alphabetical.json");
    fs.writeFile(output_path, new_flows, function (err, result) {
        if (err) console.log('error', err);
    });