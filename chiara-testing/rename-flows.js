var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/malaysia-rapidpro-sandbox-for-testing2_07.json");
var json_string = fs.readFileSync(input_path).toString();
//var props= Object.getOwnPropertyNames(obj.flows[0])[0];
var obj = JSON.parse(json_string);
i = 0;
var new_name ="";
for (i = 0; i < obj.flows.length; i++) {
  new_name= "PLH - " + obj.flows[i].name;
  obj.flows[i].name = new_name;
}
new_flows= JSON.stringify(obj,null, 2);
var output_path = path.join(__dirname, "../chiara-testing/renamed_flows.json");
fs.writeFile(output_path, new_flows, function (err, result) {
  if (err) console.log('error', err);
});