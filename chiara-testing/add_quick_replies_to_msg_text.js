var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/test_quick_replies.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var count = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var fl;
var n;
var ac;
var qr;

var curr_act;

var word_tests = ["has_any_word", "has_all_words", "has_phrase", "has_only_phrase", "has_beginning"];



for (fl = 0; fl < obj.flows.length; fl++) {
    for (n = 0; n < obj.flows[fl].nodes.length; n++) {
        for (ac = 0; ac < obj.flows[fl].nodes[n].actions.length; ac++) {
            curr_act = obj.flows[fl].nodes[n].actions[ac];
            if (curr_act.type === "send_msg") {
                for (qr = 0; qr < curr_act.quick_replies.length; qr++) {
                    obj.flows[fl].nodes[n].actions[ac].text = curr_act.text + "\n" + count[qr] + ". " + curr_act.quick_replies[qr];

                }

            }
            obj.flows[fl].nodes[n].actions[ac].quick_replies = [];
            dest_id = curr_act.exits[0].destination_uuid;
        }
    }

}
new_flows = JSON.stringify(obj, null, 2);
var output_path = path.join(__dirname, "../chiara-testing/flows_with_quick_replies_in_text.json");
fs.writeFile(output_path, new_flows, function (err, result) {
    if (err) console.log('error', err);
});