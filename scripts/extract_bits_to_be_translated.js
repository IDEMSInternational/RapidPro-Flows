var fs = require('fs');
var path = require("path");
//var input_path = path.join(__dirname, "../products/virtual-maths-camp/development/idems-vmc.json");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_helpme_alphabetical.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var bits_to_translate = {};
var localization = {};
var eng_localization = {};

var fl;
var n;
var ac;
var c;

var flow_id;
var node_id;
var case_id;
var msg_id;

var trasl_to_add;
var curr_case;
var curr_act;

var word_tests = ["has_any_word", "has_all_words", "has_phrase", "has_only_phrase", "has_beginning"];



for (fl = 0; fl < obj.flows.length; fl++) {
    for (n = 0; n < obj.flows[fl].nodes.length; n++) {
        for (ac = 0; ac < obj.flows[fl].nodes[n].actions.length; ac++) {
            curr_act = obj.flows[fl].nodes[n].actions[ac];
            if (curr_act.type == "send_msg") {
                msg_id = curr_act.uuid;
                trasl_to_add = {};
                trasl_to_add.text = [curr_act.text];
                trasl_to_add.quick_replies = curr_act.quick_replies;
                eng_localization[msg_id] = trasl_to_add;
            }
        }
        if (obj.flows[fl].nodes[n].hasOwnProperty('router')) {
            if (obj.flows[fl].nodes[n].router.operand == "@input.text") {
                for (c = 0; c < obj.flows[fl].nodes[n].router.cases.length; c++) {
                    curr_case = obj.flows[fl].nodes[n].router.cases[c];
                    if (word_tests.includes(curr_case.type)) {
                        case_id = curr_case.uuid;
                        trasl_to_add = {};
                        trasl_to_add.arguments = curr_case.arguments;
                        eng_localization[case_id] = trasl_to_add;

                    }
                }

            }



        }
    }

        flow_id = obj.flows[fl].uuid;
        flow_info = {};
        flow_info.flowid = flow_id;
        flow_info.name = obj.flows[fl].name;
        localization.eng = eng_localization;
        flow_info.localization = localization; 
        bits_to_translate[flow_id] = flow_info;
        localization = {};
        eng_localization = {};
    }
    new_flows = JSON.stringify(bits_to_translate, null, 2);
    //var output_path = path.join(__dirname, "../products/virtual-maths-camp/development/file_for_translation_idems-vmc.json");
    var output_path = path.join(__dirname, "../products/covid-19-parenting/development/translation/eng/intermediary-files/file_for_translation_plh_master.json");
    fs.writeFile(output_path, new_flows, function (err, result) {
        if (err) console.log('error', err);
    });