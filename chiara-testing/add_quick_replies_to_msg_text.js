var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/test_quick_replies.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var count = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var fl;
var nd;
var j;
var c;
var ac;
var qr;

var curr_quick_replies;
var curr_act;



for (fl = 0; fl < obj.flows.length; fl++) {
    for (nd = 0; nd < obj.flows[fl].nodes.length; nd++) {
        for (ac = 0; ac < obj.flows[fl].nodes[nd].actions.length; ac++) {
            curr_act = obj.flows[fl].nodes[nd].actions[ac];
            if (curr_act.type === "send_msg") {
                if (curr_act.quick_replies.length > 0) {
                    for (qr = 0; qr < curr_act.quick_replies.length; qr++) {
                        obj.flows[fl].nodes[nd].actions[ac].text = curr_act.text + "\n" + count[qr] + ". " + curr_act.quick_replies[qr];

                    }
                    curr_quick_replies = obj.flows[fl].nodes[nd].actions[ac].quick_replies;
                    obj.flows[fl].nodes[nd].actions[ac].quick_replies = [];
                    dest_id = obj.flows[fl].nodes[nd].exits[0].destination_uuid;
                    for (j = 0; j < obj.flows[fl].nodes.length; j++) {
                        if (obj.flows[fl].nodes[j].uuid === dest_id) {
                            if (obj.flows[fl].nodes[j].hasOwnProperty('router')) {
                                if (obj.flows[fl].nodes[j].router.operand === "@input.text") {
                                    for (c = 0; c < obj.flows[fl].nodes[j].router.cases.length; c++) {
                                        if (obj.flows[fl].nodes[j].router.cases[c].type === "has_any_word") {
                                            obj.flows[fl].nodes[j].router.cases[c].arguments = [count[c]];
                                        }
                                        else if (obj.flows[fl].nodes[j].router.cases[c].type === "has_all_words") {
                                            obj.flows[fl].nodes[j].router.cases[c].arguments = [count[c]];

                                        }
                                        else if (obj.flows[fl].nodes[j].router.cases[c].type === "has_phrase") {
                                            obj.flows[fl].nodes[j].router.cases[c].arguments = [count[c]];
                                        }
                                        else if (obj.flows[fl].nodes[j].router.cases[c].type === "has_only_phrase") {
                                            obj.flows[fl].nodes[j].router.cases[c].arguments = [count[c]];
                                        }
                                        else if (obj.flows[fl].nodes[j].router.cases[c].type === "has_beginning") {
                                            obj.flows[fl].nodes[j].router.cases[c].arguments = [count[c]];
                                        }

                                        obj.flows[fl].nodes[j].router.cases[c].type = "has_only_phrase";

                                    }

                                }


                            }

                            break;
                        }
                    }
                }
            }


        }
    }

}
new_flows = JSON.stringify(obj, null, 2);
var output_path = path.join(__dirname, "../chiara-testing/flows_with_quick_replies_in_text.json");
fs.writeFile(output_path, new_flows, function (err, result) {
    if (err) console.log('error', err);
});