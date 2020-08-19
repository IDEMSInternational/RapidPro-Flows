var fs = require('fs');
var path = require("path");
//var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_helpme.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);


var fl;

for (fl = 0; fl < obj.flows.length; fl++) {
    obj.flows[fl].expire_after_minutes = 60;
    obj.flows[fl].ignore_triggers = true;
};

new_flows = JSON.stringify(obj, null, 2);
//var output_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_new_expiration.json");
var output_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_helpme_new_expiration.json");
fs.writeFile(output_path, new_flows, function (err, result) {
    if (err) console.log('error', err);
 });