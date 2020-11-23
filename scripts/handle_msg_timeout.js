var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);


list_flows = "";
var count = 1;
for (var fl = 0; fl<obj.flows.length; fl++){
    for (var nd = 0; nd < obj.flows[fl].nodes.length; nd++) {
        if (obj.flows[fl].nodes[nd].hasOwnProperty('router') ){
            if (obj.flows[fl].nodes[nd].router.hasOwnProperty('wait')){
                if (obj.flows[fl].nodes[nd].router.wait.hasOwnProperty('timeout')){
                    list_flows = list_flows + "\n" + count + " " + obj.flows[fl].name + " " + obj.flows[fl].nodes[nd].router.wait.timeout.seconds;
                    count++;
                }
            }
        }

    }
}

var output_path = path.join(__dirname, "../products/covid-19-parenting/development/debug_timeout.txt");
fs.writeFile(output_path, list_flows, function (err, result) {
    if (err) console.log('error', err);
});