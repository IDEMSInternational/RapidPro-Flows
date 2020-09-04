var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../../products/covid-19-parenting/development/plh_master.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

// var count = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

obj = add_quick_replies_to_msg_text(obj);
var audio_rec_info = extract_text_for_audio_recording(obj); 
//var file_for_recorder = remove_repetitions_audio(audio_rec_info);



audio_rec_info = JSON.stringify(audio_rec_info, null, 2);
var output_path = path.join(__dirname, "../../products/covid-19-parenting/development/audio-recording/eng/file_for_audio_recording_plh_masterlabel.json");
fs.writeFile(output_path, audio_rec_info, function (err, result) {
    if (err) console.log('error', err);
});





function reorder_flows_alphabetically_by_name(obj) {
    obj.flows.sort(function (a, b) {
        var x = a.name.toLowerCase();
        var y = b.name.toLowerCase();
        if (x < y) { return -1; }
        if (x > y) { return 1; }
        return 0;
    });
    return obj;
}

function add_quick_replies_to_msg_text(obj) {

    var new_test = "";
    var debug = "";

    for (var fl = 0; fl < obj.flows.length; fl++) {
        debug = debug + "\n\n" + obj.flows[fl].name + "\n";
        for (var nd = 0; nd < obj.flows[fl].nodes.length; nd++) {
            for (var ac = 0; ac < obj.flows[fl].nodes[nd].actions.length; ac++) {
                var curr_act = obj.flows[fl].nodes[nd].actions[ac];
                if (curr_act.type == "send_msg") {
                    if (curr_act.quick_replies.length > 0) {
                        // for audio recording
                        obj.flows[fl].nodes[nd].actions[ac].text = obj.flows[fl].nodes[nd].actions[ac].text + " Please select the number for the following options:";
                        for (var qr = 0; qr < curr_act.quick_replies.length; qr++) {
                            // letters
                            //obj.flows[fl].nodes[nd].actions[ac].text = obj.flows[fl].nodes[nd].actions[ac].text + "\n" + count[qr] + ". " + curr_act.quick_replies[qr];

                            // decreasing numbers
                            obj.flows[fl].nodes[nd].actions[ac].text = obj.flows[fl].nodes[nd].actions[ac].text + "\n" + (curr_act.quick_replies.length - qr - 1) + ". " + curr_act.quick_replies[qr];

                        }
                        var curr_quick_replies = obj.flows[fl].nodes[nd].actions[ac].quick_replies;
                        obj.flows[fl].nodes[nd].actions[ac].quick_replies = [];
                        var dest_id = obj.flows[fl].nodes[nd].exits[0].destination_uuid;


                        debug = debug + obj.flows[fl].nodes[nd].actions[ac].text + "\n";

                        for (var j = 0; j < obj.flows[fl].nodes.length; j++) {
                            if (obj.flows[fl].nodes[j].uuid == dest_id) {
                                if (obj.flows[fl].nodes[j].hasOwnProperty('router')) {
                                    if (obj.flows[fl].nodes[j].router.operand == "@input.text") {
                                        for (var c = 0; c < obj.flows[fl].nodes[j].router.cases.length; c++) {
                                            if (obj.flows[fl].nodes[j].router.cases[c].type == "has_any_word") {

                                                //old_test = obj.flows[fl].nodes[j].router.cases[c].arguments[0] + ",";
                                                //new_test = obj.flows[fl].nodes[j].router.cases[c].arguments[0] + ",";

                                                var arg_list = obj.flows[fl].nodes[j].router.cases[c].arguments[0].split(/[\s,]+/).filter(function (i) { return i });
                                                var old_test = arg_list.join(",") + ",";
                                                var new_test = arg_list.join(",") + ",";

                                                debug = debug + "arg list: " + arg_list + "\n";
                                                for (var ar = 0; ar < arg_list.length; ar++) {

                                                    var arg = arg_list[ar];
                                                    debug = debug + "arg: " + arg + "\n";
                                                    //r_exp = new RegExp(arg, "i");
                                                    var r_exp = new RegExp(`\\b${arg}\\b`, "i");

                                                    for (var qr = 0; qr < curr_quick_replies.length; qr++) {
                                                        var quick_reply = curr_quick_replies[qr];

                                                        if (r_exp.test(quick_reply)) {
                                                            // new_test = new_test + count[qr] + ",";
                                                            new_test = new_test + (curr_quick_replies.length - qr - 1) + ",";
                                                            debug = debug + new_test + "\n";
                                                        }
                                                    }
                                                }

                                                if (new_test == old_test) {
                                                    console.log("no match" + obj.flows[fl].name)
                                                    debug = debug + "NO MATCH " + "\n";
                                                }
                                                else {
                                                    obj.flows[fl].nodes[j].router.cases[c].arguments = [new_test];
                                                    new_test = "";

                                                }

                                            }
                                            else if (obj.flows[fl].nodes[j].router.cases[c].type == "has_all_words") {

                                                var arg_list = obj.flows[fl].nodes[j].router.cases[c].arguments[0].split(/[\s,]+/);

                                                for (var qr = 0; qr < curr_quick_replies.length; qr++) {
                                                    var quick_reply = curr_quick_replies[qr];
                                                    var match_all = arg_list.every(function (word) {

                                                        var r_exp = new RegExp(word, "i");
                                                        return r_exp.test(quick_reply)

                                                    });

                                                    if (match_all) {
                                                        // new_test = new_test + count[qr] + ",";
                                                        new_test = new_test + (curr_quick_replies.length - qr - 1) + ",";


                                                    }



                                                }
                                                if (new_test == "") {
                                                    console.log("no match" + obj.flows[fl].name)
                                                    debug = debug + "NO MATCH " + "\n";
                                                }
                                                else {
                                                    obj.flows[fl].nodes[j].router.cases[c].arguments = [new_test];
                                                    new_test = "";
                                                }
                                            }
                                            else if (obj.flows[fl].nodes[j].router.cases[c].type == "has_phrase") {
                                                var arg = obj.flows[fl].nodes[j].router.cases[c].arguments[0];

                                                for (var qr = 0; qr < curr_quick_replies.length; qr++) {
                                                    var quick_reply = curr_quick_replies[qr];

                                                    var r_exp = new RegExp(arg, "i");


                                                    if (r_exp.test(quick_reply)) {

                                                        //new_test = new_test + count[qr] + ",";
                                                        new_test = new_test + (curr_quick_replies.length - qr - 1) + ",";

                                                    }



                                                }

                                                if (new_test == "") {
                                                    console.log("no match" + obj.flows[fl].name)
                                                }
                                                else {
                                                    obj.flows[fl].nodes[j].router.cases[c].arguments = [new_test];
                                                    new_test = "";

                                                }


                                            }
                                            else if (obj.flows[fl].nodes[j].router.cases[c].type == "has_only_phrase") {
                                                var arg = obj.flows[fl].nodes[j].router.cases[c].arguments[0];
                                                debug = debug + "arg: " + arg + "\n";
                                                for (var qr = 0; qr < curr_quick_replies.length; qr++) {
                                                    var quick_reply = curr_quick_replies[qr];

                                                    if (quick_reply.toLowerCase().trim() == arg.toLowerCase().trim()) {
                                                        //new_test = new_test + count[qr] + ",";
                                                        new_test = new_test + (curr_quick_replies.length - qr - 1) + ",";
                                                        debug = debug + new_test + "\n";

                                                    }



                                                }
                                                if (new_test == "") {
                                                    debug = debug + "NO MATCH " + "\n";
                                                    console.log("no match" + obj.flows[fl].name)


                                                }
                                                else {
                                                    obj.flows[fl].nodes[j].router.cases[c].arguments = [new_test];
                                                    new_test = "";
                                                }

                                            }



                                            obj.flows[fl].nodes[j].router.cases[c].type = "has_any_word";

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

    return obj;
}


function extract_text_for_audio_recording(obj) {
    var bits_to_record = [];
    var new_bit = {};

    for (var fl = 0; fl < obj.flows.length; fl++) {
        for (var n = 0; n < obj.flows[fl].nodes.length; n++) {
            for (var ac = 0; ac < obj.flows[fl].nodes[n].actions.length; ac++) {
                var curr_act = obj.flows[fl].nodes[n].actions[ac];
                if (curr_act.type == "send_msg") {
                    new_bit.flow_name = obj.flows[fl].name.replace("PLH - ", "").split(/[\s-]+/).filter(function(i){return i}).join("-");
                    new_bit.flow_id = obj.flows[fl].uuid;
                    new_bit.node_id = obj.flows[fl].nodes[n].uuid;
                    new_bit.msg_id = curr_act.uuid;
                    new_bit.text = curr_act.text;
                    new_bit.label = new_bit.flow_name + "_" + new_bit.node_id + "_" + new_bit.msg_id;
                    new_bit.type = "audio";
                    bits_to_record.push(Object.assign({}, new_bit));
                    new_bit = {};
                }
            }

        }
    }

    return bits_to_record;
}

function remove_repetitions_audio(audio_rec_info){
    var to_record = [];
    var distinct_text = [... new Set(audio_rec_info.map(x => (x.text)) )];
    
}