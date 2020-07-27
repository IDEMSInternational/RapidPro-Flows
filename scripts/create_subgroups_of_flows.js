var fs = require('fs');
var path = require("path");

var file_to_split = "plh-master24_07_with_quick_replies_in_text";
var input_path = path.join(__dirname, "../products/covid-19-parenting/", file_to_split+ ".json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);



var fl;
var N_FL_TOT = obj.flows.length;
console.log(N_FL_TOT)
var N_FL_GR = 100;
var n_group = Math.floor(N_FL_TOT/N_FL_GR); 
console.log(n_group)
var rem = N_FL_TOT%N_FL_GR;
console.log(rem)

var gr;
var fl;
var i = 0;



for (gr = 1; gr <= n_group; gr++) {
    
    new_flows = Object.assign({}, obj);
    new_flows.flows = [];
    new_flows.triggers = [];
    
    for (fl = 0; fl < N_FL_GR; fl++){
        new_flows.flows.push(obj.flows[i]);
        i++;
    }
    new_file = JSON.stringify(new_flows, null, 2);
    var output_path = path.join(__dirname, "../products/covid-19-parenting/split/", file_to_split + "group"+ gr +".json");
    fs.writeFile(output_path, new_file, function (err, result) {
        if (err) console.log('error', err);
    });
    console.log(new_flows.flows.length)
 }
    
   if (rem > 0){

    new_flows = Object.assign({}, obj);
    new_flows.flows =[];
    new_flows.triggers = [];

    for (fl = 0; fl < rem; fl++){
        new_flows.flows.push(obj.flows[i]);
        i++;
    }
    new_file = JSON.stringify(new_flows, null, 2);
    var output_path = path.join(__dirname, "../products/covid-19-parenting/split/", file_to_split + "group"+ gr +".json");
    fs.writeFile(output_path, new_file, function (err, result) {
        if (err) console.log('error', err);
    });
    console.log(new_flows.flows.length)
   }