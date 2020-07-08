var fs = require('fs');
var path = require("path");
var inputpath = path.join(__dirname, "../products/covid-19-parenting/malaysia-rapidpro-sandbox-for-testing2_07.json")
var jsonstring = fs.readFileSync(inputpath).toString();
//var props= Object.getOwnPropertyNames(obj.flows[0])[0];
var obj=JSON.parse(jsonstring);
i = 0;
var flows_list = {};
for (i = 0; i<obj.flows.length; i++){
        flows_list[obj.flows[i].name]=obj.flows[i].name;
} 
flows_list = JSON.stringify(flows_list,null,4);
var outputpath = path.join(__dirname, "../santiago-testing/list_of_flows.json")
fs.writeFile(outputpath,flows_list, function(err, result) {
    if(err) console.log('error', err);
});