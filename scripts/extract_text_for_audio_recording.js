var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_no_quick_replies.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var bits_to_record = [];
var new_bit = {};







for (var fl = 0; fl < obj.flows.length; fl++) {
    for (var n = 0; n < obj.flows[fl].nodes.length; n++) {
        for (var ac = 0; ac < obj.flows[fl].nodes[n].actions.length; ac++) {
            var curr_act = obj.flows[fl].nodes[n].actions[ac];
            if (curr_act.type == "send_msg") {
                new_bit.flow_id = obj.flows[fl].uuid;
                new_bit.node_id = obj.flows[fl].nodes[n].uuid;
                new_bit.msg_id = curr_act.uuid;
                new_bit.original_text = curr_act.text;

                // handle contact fields or results
                new_bit.text_to_read = curr_act.text.replace("@results.count ","").replace("@fields.survey_behave_name","your child").replace("@results.n_skills_week","the following").replace("@results.n_skills", "the number of skills in your toolkit");
                
                new_bit.type = "audio";
                bits_to_record.push(Object.assign({}, new_bit));
                new_bit = {};
            }
        }
       
    }
}

var to_record = JSON.stringify(bits_to_record, null, 2);
//to_record = to_record.replace(/\\\"HelpMe\\\"/gi,'\\"HelpMe\\" (as one word)');

var output_path = path.join(__dirname, "../products/covid-19-parenting/development/audio-recording/eng/file_for_audio_recording_plh_master.json");
    fs.writeFile(output_path, to_record, function (err, result) {
        if (err) console.log('error', err);
    });