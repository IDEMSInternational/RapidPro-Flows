var fs = require('fs');
var path = require("path");

var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");

var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var input_path_flow_names = path.join(__dirname, "../products/covid-19-parenting/development/new_names_for_flows.json");
var json_string_flow_names = fs.readFileSync(input_path_flow_names).toString();
var old_new_names = JSON.parse(json_string_flow_names);


var old_names = [];
var new_names = [];

for (na in old_new_names){
    old_names.push(na);
    new_names.push(old_new_names[na].new_name);

}

for (var fl = 0; fl < obj.flows.length; fl++) {
    
    if(old_names.includes(obj.flows[fl].name)){
        console.log(obj.flows[fl].name)
        obj.flows[fl].name = old_new_names[obj.flows[fl].name].new_name;
    }

    for (var nd = 0; nd < obj.flows[fl].nodes.length; nd++){
        if (obj.flows[fl].nodes[nd].actions.length > 0 && obj.flows[fl].nodes[nd].actions[0].type == "enter_flow" && old_names.includes(obj.flows[fl].nodes[nd].actions[0].flow.name)){
            obj.flows[fl].nodes[nd].actions[0].flow.name = old_new_names[obj.flows[fl].nodes[nd].actions[0].flow.name].new_name;
        }

    } 
    
}

renamed_flows = JSON.stringify(obj, null, 2);


output_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_renamed.json");
fs.writeFile(output_path, renamed_flows, function (err, result) {
    if (err) console.log('error', err);
});
