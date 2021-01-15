const { match } = require('assert');
var fs = require('fs');
var path = require("path");

var input_path = path.join(__dirname, "../products/covid-19-parenting/development/test_update_flows_review/Activity - Entries.json");
var json_string = fs.readFileSync(input_path).toString();
var csv_json = JSON.parse(json_string);
csv_json.shift();

var input_path_flow = path.join(__dirname, "../products/covid-19-parenting/development/test_update_flows_review/plh_master.json");
var json_string = fs.readFileSync(input_path_flow).toString();
var original_flows = JSON.parse(json_string);

var flows_IDs = [];
csv_json.forEach(row => { flows_IDs.push(row[16])   
});
var flows_IDs = [...new Set(flows_IDs)];

var updated_flows = [];

flows_IDs.forEach(id => {
    var upd_flow = original_flows["flows"].filter(function (fl) { return (fl.uuid == id) })[0];
    console.log(upd_flow.name)
    var flow_rows = csv_json.filter(function (row) { return (row[16] == id) });

    flow_rows.forEach(row =>{
        var action_id = row[17];
        var check = 0;
        for (var nd = 0; nd < upd_flow.nodes.length; nd++){
            
            var matching_action = upd_flow.nodes[nd].actions.filter(function(ac){return (ac.uuid == action_id)});
            if (matching_action.length == 1){
                check++
                matching_action[0].text = row[4];
                var n_qr = matching_action[0].quick_replies.length;
                if (n_qr >0){
                   var new_qr = [];
                   for (var qr = 1; qr <= n_qr; qr++){
                       new_qr.push(row[4 +qr]);
                   }
                   matching_action[0].quick_replies = new_qr;

                }
                break
            }
            
        }
        if (check==0){
            console.log("no match ac " + action_id)
        }
        
    })

    updated_flows.push(Object.assign({}, upd_flow));
})




// write output
var updated_flows = JSON.stringify(updated_flows, null, 2);
var output_path = path.join(__dirname, "../products/covid-19-parenting/development/test_update_flows_review/flow_activity_updated.json");
fs.writeFile(output_path, updated_flows, function (err, result) {
    if (err) console.log('error', err);
});
