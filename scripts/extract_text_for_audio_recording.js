var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_for_audio_recording.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var bits_to_record = [];
var new_bit = {};


var fl;
var n;
var ac;

var flow_id;
var node_id;
var msg_id;



for (fl = 0; fl < obj.flows.length; fl++) {
    for (n = 0; n < obj.flows[fl].nodes.length; n++) {
        for (ac = 0; ac < obj.flows[fl].nodes[n].actions.length; ac++) {
            curr_act = obj.flows[fl].nodes[n].actions[ac];
            if (curr_act.type == "send_msg") {
                new_bit.flow_id = obj.flows[fl].uuid;
                new_bit.node_id = obj.flows[fl].nodes[n].uuid;
                new_bit.msg_id = curr_act.uuid;
                new_bit.text = curr_act.text;
                bits_to_record.push(Object.assign({}, new_bit));
                new_bit = {};
            }
        }
       
    }
}

var to_record = JSON.stringify(bits_to_record, null, 2);
    var output_path = path.join(__dirname, "../products/covid-19-parenting/development/audio-recording/eng/file_for_audio_recording_plh_master.json");
    fs.writeFile(output_path, to_record, function (err, result) {
        if (err) console.log('error', err);
    });