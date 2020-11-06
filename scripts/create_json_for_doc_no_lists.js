var fs = require('fs');
var path = require("path");

var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var input_path_file_names = path.join(__dirname, "../products/covid-19-parenting/development/flows_by_template.json");
var json_string_file_names = fs.readFileSync(input_path_file_names).toString();
var flows_by_template = JSON.parse(json_string_file_names);


/// flows with timed introduction

var timed_intros = flows_by_template.filter(function (flow) { return (flow.name.endsWith("Timed intro")) });

for (var fl = 0; fl < timed_intros.length; fl++) {
    var doc_cont = {};


    var curr_flow_intro = obj.flows.filter(function (flow) { return (flow.name == timed_intros[fl].name) })[0];
    console.log(curr_flow_intro.name)
    var curr_flow_tip = obj.flows.filter(function (flow) { return (flow.name == timed_intros[fl].name.replace(" - Timed intro", "")) })[0];
    if (flows_by_template.filter(function (flow) { return (flow.name == curr_flow_tip.name) }).length == 0) {
        continue;
    }



    var curr_flow_doc = {};

    var flow_content = {};


    var curr_node_intro = curr_flow_intro.nodes[0];
    var type_of_template_intro = timed_intros[fl].type;


    var curr_node_tip = curr_flow_tip.nodes[0];
    var type_of_template_tip = flows_by_template.filter(function (flow) { return (flow.name == (timed_intros[fl].name.replace(" - Timed intro", ""))) })[0].type;

    var n_mess_block = 0;
    var curr_flow = curr_flow_intro;
    create_template(type_of_template_intro, curr_node_intro)

    var n_mess_block = 0;
    curr_flow = curr_flow_tip;
    create_template(type_of_template_tip, curr_node_tip)


    flows_by_template = flows_by_template.filter(function (flow) { return (flow.name != curr_flow_tip.name) });
    flows_by_template = flows_by_template.filter(function (flow) { return (flow.name != curr_flow_intro.name) });

    flow_info = {};
    flow_info["Id intro"] = curr_flow_intro.uuid;
    flow_info["Id tip"] = curr_flow_tip.uuid;
    flow_info["Template type"] = type_of_template_tip.toString();

    //////////////////////////////////////////////////////

    // add content to object for flow
    curr_flow_doc.Content = flow_content;
    curr_flow_doc["Technical information"] = flow_info;
    // add flow to list of flows for doc

    doc_cont[curr_flow_tip.name] = curr_flow_doc;

    // write output
    doc_cont = JSON.stringify(doc_cont, null, 2);
    var output_path = path.join(__dirname, "../gdoc/JSON_files/" + curr_flow_tip.name + ".json");
    fs.writeFile(output_path, doc_cont, function (err, result) {
        if (err) console.log('error', err);
    });
    console.log("qui")

}


//////////////////////////////////////////////////////////////////
/// flows without  timed introduction
for (var fl = 0; fl < flows_by_template.length; fl++) {

    //for (var fl = flows_by_template.length - 1; fl < flows_by_template.length; fl++) {
    //for (var fl = 127; fl < 129; fl++) {    
    var doc_cont = {};

    var curr_flow = obj.flows.filter(function (flow) { return (flow.name == flows_by_template[fl].name) })[0];
    console.log(flows_by_template[fl].name)

    var curr_flow_doc = {};
    var flow_content = {};

    var curr_node = curr_flow.nodes[0];
    var type_of_template = flows_by_template[fl].type;

    var n_mess_block = 0;

    create_template(type_of_template, curr_node)

    flow_info = {};
    flow_info.Id = curr_flow.uuid;
    flow_info.Template_type = type_of_template.toString();

    //////////////////////////////////////////////////////

    // add content to object for flow
    curr_flow_doc.Content = flow_content;
    curr_flow_doc["Technical information"] = flow_info;
    // add flow to list of flows for doc

    doc_cont[curr_flow.name] = curr_flow_doc;

    // write output
    doc_cont = JSON.stringify(doc_cont, null, 2);
    var output_path = path.join(__dirname, "../gdoc/JSON_files/" + curr_flow.name + ".json");
    fs.writeFile(output_path, doc_cont, function (err, result) {
        if (err) console.log('error', err);
    });

}








////////////////////////////////////////////////////////////////////////
/// FUNCTIONS /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////
// Templates
///////////////////////////////////////////////////////////////
function create_template(type_of_template, curr_node) {
    if (type_of_template == 1) {
        template_1(curr_node)
    }
    else if (type_of_template == 2) {
        template_2(curr_node)
    }
    else if (type_of_template == 3) {
        template_3(curr_node)
    }
    else if (type_of_template == 4) {
        template_4(curr_node)
    }
    else if (type_of_template == 5) {
        template_5(curr_node)
    }
    else if (type_of_template == 6) {
        template_6(curr_node)
    }
    else if (type_of_template == 7) {
        template_7(curr_node)
    }
    else if (type_of_template == 8) {
        template_8(curr_node)
    }
    else if (type_of_template == 9) {
        template_9(curr_node)
    } else if (type_of_template == 10) {
        template_10(curr_node)
    } else if (type_of_template == 11) {
        template_11(curr_node)
    }
    else {
        error("template not recognised")
    }


}

///////////////////////////////////////////////////////
// Template 1 - send messages

function template_1(curr_node) {
    create_message_block(curr_node);
}

/////////////////////////////////////////////////////////
// Template 2 - theme split , video & list

function template_2(curr_node) {
    var block_output = create_default_intro_block(curr_node);
    curr_node = block_output;


    block_output = create_media_block(curr_node);
    curr_node = block_output;


    block_output = create_list_of_tips_block(curr_node);
    curr_node = block_output;


    block_output = create_message_block(curr_node);

}

//////////////////////////////////////////////////////
// Template 3 - 

function template_3(curr_node) {
    var block_output = create_message_block(curr_node);
    curr_node = block_output;


    block_output = create_media_block(curr_node);
    curr_node = block_output;

    block_output = create_message_block(curr_node);

}

///////////////////////////////////////////////////////////
// Template 4

function template_4(curr_node) {
    var block_output = create_default_intro_block(curr_node);
    curr_node = block_output;


    block_output = create_media_block(curr_node);
    curr_node = block_output;


    block_output = create_message_block(curr_node);
    curr_node = block_output;


    block_output = create_list_of_tips_block(curr_node);
    curr_node = block_output;


    block_output = create_message_block(curr_node);

}

//////////////////////////////////////////////////////////////////////
// Template 5
function template_5(curr_node) {
    create_intro_for_timed_block(curr_node)
}

///////////////////////////////////////////////////////////////////////
// Template  6

function template_6(curr_node) {
    var block_output = create_default_intro_block(curr_node);
    curr_node = block_output;

    var block_output = create_media_block(curr_node);
    curr_node = block_output;

    var block_output = create_message_block(curr_node);

}


//////////////////////////////////////////////////////////
// Template 7

function template_7(curr_node) {
    var block_output = create_default_intro_block(curr_node);
    curr_node = block_output;


    block_output = create_media_block(curr_node);
    curr_node = block_output;

    block_output = create_age_split_block(curr_node, 1);
    curr_node = block_output;



    block_output = create_list_of_tips_block(curr_node);
    curr_node = block_output;


    block_output = create_message_block(curr_node);

}

///////////////////////////////////////////////////////
// Template 8

function template_8(curr_node) {
    var block_output = create_default_intro_block(curr_node);
    curr_node = block_output;


    block_output = create_media_block(curr_node);
    curr_node = block_output;

    block_output = create_message_block(curr_node);
    curr_node = block_output;


    block_output = create_age_split_block(curr_node, 2);
    curr_node = block_output;


    block_output = create_message_block(curr_node);

}
///////////////////////////////////////////////////////
// Template 9

function template_9(curr_node) {
    var block_output = create_message_block(curr_node);
    curr_node = block_output;

    block_output = create_age_split_block(curr_node, 2);
    curr_node = block_output;

    block_output = create_message_block(curr_node);

}

///////////////////////////////////////////////////////
// Template 10

function template_10(curr_node) {
    var block_output = create_age_split_block(curr_node, 1);
    curr_node = block_output;

}
/////////////////////////////////////////////////////////
// Template 11

function template_11(curr_node) {
    var block_output = create_default_intro_block(curr_node);
    curr_node = block_output;

    block_output = create_media_block(curr_node);
    curr_node = block_output;

    block_output = create_multiple_choice_block(curr_node);
    curr_node = block_output;

    block_output = create_message_block(curr_node);

}


/////////////////////////////////////////////////////////

/////////////////////////////////// functions for generating content blocks ///////////////////////////////////////////////////////////////


////////////////////////////////////////////////
//send_messages block
function create_message_block(curr_node) {
    n_mess_block++;
    var n_mess = 1;
    var r_exp_yes = new RegExp(`\\byes\\b`, "i");
    var r_exp_no = new RegExp(`\\bno\\b`, "i");
    var curr_block = {};

    var curr_block_messages = [];



    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {
            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) });
            if (next_node.length == 0) {
                console.log("end of flow")
                next_node = null;
                go_on = false;
                curr_block_messages.push(message[0].text);
            } else {
                if (next_node[0].hasOwnProperty('router')) {
                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        var ends_with_wfr = true;

                        var interaction_message = message[0].text;

                        var wfr_node = next_node[0];


                        if (wfr_node.router.cases.filter(function (ca) { return (r_exp_yes.test(ca.arguments[0])) }).length > 0) {
                            var interaction_yes_no = true;
                            var yes_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_yes.test(ca.arguments[0])) })[0].category_uuid;

                            var yes_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == yes_categ_id) })[0];
                            var yes_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == yes_categ.exit_uuid) })[0].destination_uuid;
                            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];
                            if (next_node.actions.length > 0) {

                                if (next_node.actions.type == "set_contact_field" && next_node.actions.type.field.key == "last_interaction") {
                                    next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node.exits[0].destination_uuid) })[0];

                                }
                            }

                            var no_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_no.test(ca.arguments[0])) })[0].category_uuid;
                            var no_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == no_categ_id) })[0];
                            var no_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == no_categ.exit_uuid) })[0].destination_uuid;
                            var no_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == no_node_id) })[0];


                            var curr_block_no_messages = loop_message_nodes(no_node, "null")[0];
                        } else {
                            var interaction_yes_no = false;
                        }


                    } else {

                        curr_block_messages.push(message[0].text);
                        next_node = next_node[0];
                    }
                } else {
                    go_on = true;
                    curr_block_messages.push(message[0].text);
                    curr_node = next_node[0];



                }



            }

        }
        else {
            go_on = false;
            console.log("this is not a send message node")
            next_node = null;
        }
    }
    while (go_on);

    for (var m = 0; m < curr_block_messages.length; m++) {
        if (curr_block_messages.length == 1) {
            curr_block["Message"] = curr_block_messages[0];
        } else {
            curr_block["Message " + (m + 1)] = curr_block_messages[m];
        }
    }
    if (ends_with_wfr) {
        curr_block["Interaction message"] = interaction_message;
        if (interaction_yes_no) {
            for (var n = 0; n < curr_block_no_messages.length; n++) {
                if (curr_block_no_messages.length == 1) {
                    curr_block["Message for negative answer"] = curr_block_no_messages[0];
                } else {
                    curr_block["Message for negative answer " + (n + 1)] = curr_block_no_messages[n];
                }
            }
        }
    }



    flow_content["Set of messages " + n_mess_block] = curr_block;

    if (ends_with_wfr && interaction_yes_no) {
        if (next_node.actions.filter(function (ac) { return (ac.type == "send_msg") }).length > 0) {
            next_node = create_message_block(next_node)
        }

    }



    return next_node


}

function loop_message_nodes(curr_node, stop_node_id) {
    var messages_to_send = [];
    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {
            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) });
            if (next_node.length == 0) {
                console.log("end of flow")
                next_node = null;
                go_on = false;
                messages_to_send.push(message[0].text);
            } else {
                if (next_node[0].hasOwnProperty('router')) {
                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        console.log("ended in interaction node")
                        next_node = next_node[0];


                    } else {

                        messages_to_send.push(message[0].text);
                        next_node = next_node[0];
                    }
                } else {
                    if (next_node[0].uuid == stop_node_id) {
                        go_on = false;
                        messages_to_send.push(message[0].text);
                        next_node = next_node[0];

                    } else {
                        go_on = true;
                        messages_to_send.push(message[0].text);
                        curr_node = next_node[0];
                    }




                }



            }

        }
        else {
            go_on = false;
            console.log("this is not a send message node")
            next_node = null;
        }
    }
    while (go_on);
    return [messages_to_send, next_node, curr_node]
}



////////////////////////////////////////////
// media block 
function create_media_block(curr_node) {

    var curr_block = {};
    var next_node = null;

    if (curr_node.hasOwnProperty('router') && curr_node.router.operand == "@fields.type_of_media") {
        if (curr_node.router.cases.length == 1) {
            if (curr_node.router.cases[0].arguments[0] == "high") {

                var video_category = curr_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase() == "high") })[0];
                var video_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == video_category.exit_uuid) })[0].destination_uuid;
                var video_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == video_node_id) })[0];

                var other_category = curr_node.router.categories.filter(function (cat) { return (cat.name == "Other") })[0];
                var next_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == other_category.exit_uuid) })[0].destination_uuid;
                next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node_id) })[0];
                var video = {};
                video["Text"] = video_node.actions[0].text;
                if (video_node.actions[0].attachments.length > 0) {
                    video["Link"] = (video_node.actions[0].attachments[0].slice(6, -2)).replace("@(fields.video_script_path & \"", "https://idems-media-recorder.web.app/storage/project/PLH/subproject/Rapidpro/deployment/Global/resourceGroup/videoScript/eng/")
                } else {
                    video["Link"] = "missing";
                }

                curr_block["Video"] = video;
            } else if (curr_node.router.cases[0].arguments[0] == "low") {
                //for relax audio 

            } else {
                console.log("1 argument but not high or low")
            }
        } else if (curr_node.router.cases.length == 2) {
            var video_category = curr_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase() == "high") })[0];
            var video_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == video_category.exit_uuid) })[0].destination_uuid;

            var video_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == video_node_id) })[0];
            var video = {};
            video["Text"] = video_node.actions[0].text;
            if (video_node.actions[0].attachments.length > 0) {
                video["Link"] = (video_node.actions[0].attachments[0].slice(6, -2)).replace("@(fields.video_script_path & \"", "https://idems-media-recorder.web.app/storage/project/PLH/subproject/Rapidpro/deployment/Global/resourceGroup/videoScript/eng/")
            } else {
                video["Link"] = "missing";
            }
            curr_block["Video"] = video;

            var audio_category = curr_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase() == "medium") })[0];
            var audio_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == audio_category.exit_uuid) })[0].destination_uuid;
            var audio_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == audio_node_id) })[0];
            var audio = {};
            audio["Text"] = audio_node.actions[0].text;
            if (audio_node.actions[0].attachments.length > 0) {
                audio["Link"] = audio_node.actions[0].attachments[0].slice(6);
            } else {
                audio["Link"] = "missing";
            }

            curr_block["Audio"] = audio;

            next_node_id = audio_node.exits[0].destination_uuid;
            next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node_id) })[0];


            var low_category = curr_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase() == "other") })[0];
            var low_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == low_category.exit_uuid) })[0].destination_uuid;

            var low_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == low_node_id) })[0];
            curr_block["Low media text option"] = {};
            var text_version = loop_message_nodes(low_node, next_node_id);
            if (text_version[1].uuid == next_node_id) {
                for (var n = 0; n < text_version[0].length; n++) {
                    if (text_version[0].length == 1) {
                        curr_block["Low media text option"]["Message"] = text_version[0][0];
                    } else {
                        curr_block["Low media text option"]["Message " + (n + 1)] = text_version[0][n];
                    }
                }
            } else {
                console.log("error, the media split does not rejoin")
            }




        }
        else { console.log("too many arguments") }


    } else {
        console.log("error, there is no media split")
    }


    flow_content["Media"] = curr_block;
    return next_node
}


////////////////////////////////////////////////////////////
// Default intro block

function create_default_intro_block(skill_node) {
    var r_exp_yes = new RegExp(`\\byes\\b`, "i");
    var r_exp_no = new RegExp(`\\bno\\b`, "i");
    var curr_block = {};

    var curr_block_messages = [];



    var toolkit_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == skill_node.exits[0].destination_uuid) })[0];
    var split_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == toolkit_node.exits[0].destination_uuid) })[0];
    var msg_cat = split_node.router.categories.filter(function (cat) { return (cat.name == "Other") })[0];
    var msg_node_id = split_node.exits.filter(function (ex) { return (ex.uuid == msg_cat.exit_uuid) })[0].destination_uuid;

    var curr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == msg_node_id) })[0];


    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {

            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) });
            if (next_node.length == 0) {
                console.log("end of flow")
                next_node = null;
                go_on = false;
                curr_block_messages.push(message[0].text);
            } else {
                if (next_node[0].hasOwnProperty('router')) {

                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        var interaction_message = message[0].text;
                        var wfr_node = next_node[0];
                        var yes_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_yes.test(ca.arguments[0])) })[0].category_uuid;
                        var yes_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == yes_categ_id) })[0];
                        var yes_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == yes_categ.exit_uuid) })[0].destination_uuid;

                        var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];

                        if (next_node.actions.length > 0) {

                            if (next_node.actions[0].type == "set_contact_field") {
                                if (next_node.actions[0].field.key == "last_interaction") {

                                    yes_node_id = next_node.exits[0].destination_uuid;
                                    next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];
                                }
                            }
                        }



                        var no_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_no.test(ca.arguments[0])) })[0].category_uuid;
                        var no_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == no_categ_id) })[0];
                        var no_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == no_categ.exit_uuid) })[0].destination_uuid;
                        var no_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == no_node_id) })[0];


                        var curr_block_no_messages = loop_message_nodes(no_node, "null")[0];
                    } else {

                        curr_block_messages.push(message[0].text);
                        next_node = next_node[0];
                    }
                } else {
                    go_on = true;
                    curr_block_messages.push(message[0].text);
                    curr_node = next_node[0];



                }



            }

        }
        else {
            go_on = false;
            console.log("this is not a send message node")
            next_node = null;
        }
    }
    while (go_on);

    for (var m = 0; m < curr_block_messages.length; m++) {
        if (curr_block_messages.length == 1) {
            curr_block["Message"] = curr_block_messages[0];
        } else {
            curr_block["Message " + (m + 1)] = curr_block_messages[m];
        }
    }

    curr_block["Interaction message"] = interaction_message;

    for (var n = 0; n < curr_block_no_messages.length; n++) {
        if (curr_block_no_messages.length == 1) {
            curr_block["Message for negative answer"] = curr_block_no_messages[0];
        } else {
            curr_block["Message for negative answer " + (n + 1)] = curr_block_no_messages[n];
        }
    }




    flow_content["Default introduction"] = curr_block;
    return next_node


}

function create_list_of_tips_block(toolkit_node) {
    var r_exp = new RegExp(`\\bn\\b`, "i");
    var curr_block = {};


    var curr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == toolkit_node.exits[0].destination_uuid) })[0];

    var parts_of_text = curr_node.actions[0].text.split("1. ");
    curr_block["Message"] = parts_of_text[0];

    var tips = parts_of_text[1].split("\n").filter(function (i) { return i });
    tips.pop();


    var wfr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) })[0];

    for (var t = 0; t < tips.length; t++) {
        var r_exp_tip = new RegExp(`\\b${t + 1}\\b`, "i");

        var curr_opt_messages = [];
        var tip_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_tip.test(ca.arguments[0])) })[0].category_uuid;
        var tip_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == tip_categ_id) })[0];
        var tip_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == tip_categ.exit_uuid) })[0].destination_uuid;
        var tip_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == tip_node_id) })[0];
        curr_opt_messages.push(tip_node.actions[0].text);
        var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == tip_node.exits[0].destination_uuid) })[0];

        while (!next_node.actions[0].text.startsWith("Please select another number")) {
            curr_opt_messages.push(next_node.actions[0].text);
            next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node.exits[0].destination_uuid) })[0];


        }

        curr_opt = {};
        for (var m = 0; m < curr_opt_messages.length; m++) {
            if (curr_opt_messages.length == 1) {
                curr_opt["Message"] = curr_opt_messages[0];
            } else {
                curr_opt["Message " + (m + 1)] = curr_opt_messages[m];
            }
        }


        var curr_opt_name = "";
        if (t == 0) { curr_opt_name = tips[t] } else { curr_opt_name = tips[t].slice(3) };
        curr_block["Option " + (t + 1) + ": " + curr_opt_name] = curr_opt;




    }

    curr_block["Message for choosing another tip"] = next_node.actions[0].text.split("1. ")[0];


    var new_node_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp.test(ca.arguments[0])) })[0].category_uuid;
    var new_node_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == new_node_categ_id) })[0];
    var new_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == new_node_categ.exit_uuid) })[0].destination_uuid;
    var new_block_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == new_node_id) })[0];

    flow_content["List of tips"] = curr_block;

    return new_block_node

}

//////////////////////////////////////////////////////////////
// Intro for timed

function create_intro_for_timed_block(skill_node) {
    var r_exp_yes = new RegExp(`\\byes\\b`, "i");
    var r_exp_no = new RegExp(`\\bno\\b`, "i");
    var curr_block = {};

    curr_block_messages = [];

    var toolkit_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == skill_node.exits[0].destination_uuid) })[0];
    var curr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == toolkit_node.exits[0].destination_uuid) })[0];

    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {
            curr_block_messages.push(message[0].text);

            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) });
            if (next_node.length == 0) {
                console.log("error fine flow")
                go_on = false;

            } else {
                if (next_node[0].hasOwnProperty('router')) {
                    go_on = false;
                    if (next_node[0].router.type == "switch" && next_node[0].router.operand == "@fields.toolkit") {
                        var not_compl_cat = next_node[0].router.categories.filter(function (cat) { return (cat.name == "Other") })[0];
                        var not_compl_id = next_node[0].exits.filter(function (ex) { return (ex.uuid == not_compl_cat.exit_uuid) })[0].destination_uuid;

                        var not_compl_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == not_compl_id) })[0];
                        var not_completed_msg = not_compl_node.actions[0].text;

                        var already_compl_cat = next_node[0].router.categories.filter(function (cat) { return (cat.name != "Other") })[0];
                        var already_compl_id = next_node[0].exits.filter(function (ex) { return (ex.uuid == already_compl_cat.exit_uuid) })[0].destination_uuid;

                        var already_compl_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == already_compl_id) })[0];
                        var already_completed_msg = already_compl_node.actions[0].text;

                        var wfr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == already_compl_node.exits[0].destination_uuid) })[0];

                    } else {
                        console.log("error this is not a split by toolkit")
                    }



                } else {
                    go_on = true;

                    curr_node = next_node[0];



                }



            }

        }
        else {
            go_on = false;
            console.log("this is not a send message node")
            next_node = null;
        }
    }
    while (go_on);

    var yes_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_yes.test(ca.arguments[0])) })[0].category_uuid;
    var yes_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == yes_categ_id) })[0];
    var yes_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == yes_categ.exit_uuid) })[0].destination_uuid;

    var yes_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];
    while (yes_node.actions[0].type != "enter_flow") {
        yes_node_id = yes_node.exits[0].destination_uuid;
        yes_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];
    }



    var no_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_no.test(ca.arguments[0])) })[0].category_uuid;
    var no_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == no_categ_id) })[0];
    var no_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == no_categ.exit_uuid) })[0].destination_uuid;
    var no_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == no_node_id) })[0];


    var curr_block_no_messages = loop_message_nodes(no_node, "null")[0];


    for (var m = 0; m < curr_block_messages.length; m++) {
        if (curr_block_messages.length == 1) {
            curr_block["Message"] = curr_block_messages[0];
        } else {
            curr_block["Message " + (m + 1)] = curr_block_messages[m];
        }
    }
    curr_block["Interaction message"] = not_completed_msg;
    curr_block["Interaction message if already completed"] = already_completed_msg;

    for (var n = 0; n < curr_block_no_messages.length; n++) {
        if (curr_block_no_messages.length == 1) {
            curr_block["Message for negative answer"] = curr_block_no_messages[0];
        } else {
            curr_block["Message for negative answer " + (n + 1)] = curr_block_no_messages[n];
        }
    }

    /*
    curr_block["Corresponding flow"] = {};
    curr_block["Corresponding flow"]["Name"] = yes_node.actions[0].flow.name;
    curr_block["Corresponding flow"]["Id"] = yes_node.actions[0].flow.uuid;
*/

    flow_content["Introduction for timed content"] = curr_block;
}


/////////////////////////////////////////////////////////////////////
// age splits
function create_age_split_block(split_node, type) {

    //if (!split_node.hasOwnProperty('router') || split_node.router.type != "switch" || !(split_node.router.operand == "@fields.age_group_for_tips" || split_node.router.operand == "@fields.chosen_difficult_age" || split_node.router.operand == "parent_baby" || split_node.router.operand == "parent_young_child" || split_node.router.operand == "parent_teenager")) {
    //    error("the first node is not a split by age")
    //}

    var curr_block = {};


    if (type == 1) {


        var next_nodes_ids = [];
        for (var ca = 0; ca < split_node.router.categories.length; ca++) {
            next_nodes_ids.push(split_node.exits.filter(function (ex) { return (ex.uuid == split_node.router.categories[ca].exit_uuid) })[0].destination_uuid);
        }
        var next_node = null;
        var distinct_next_nodes_ids = [...new Set(next_nodes_ids)];

        while (distinct_next_nodes_ids.length == next_nodes_ids.length && next_nodes_ids.filter(function (id) { return (id == null) }).length == 0) {

            curr_nodes_ids = next_nodes_ids;
            next_nodes_ids = [];
            curr_nodes_ids.forEach(id => {
                next_nodes_ids.push(curr_flow.nodes.filter(function (nd) { return (nd.uuid == id) })[0].exits[0].destination_uuid);
            })
            distinct_next_nodes_ids = [...new Set(next_nodes_ids)];
        }

        if (next_nodes_ids.filter(function (id) { return (id == null) }).length != 0) {
            stop_node_id = "null"
        } else {
            var count = next_nodes_ids =>
                next_nodes_ids.reduce((a, b) => ({
                    ...a,
                    [b]: (a[b] || 0) + 1
                }), {}) // don't forget to initialize the accumulator

            var duplicates = dict =>
                Object.keys(dict).filter((a) => dict[a] > 1)

            stop_node_id = duplicates(count(next_nodes_ids));
            next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == stop_node_id) })[0];
        }

        split_node.router.categories.forEach(el => {
            var msg_node_id = split_node.exits.filter(function (ex) { return (ex.uuid == el.exit_uuid) })[0].destination_uuid;
            msg_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == msg_node_id) })[0];
            var curr_age_messages = loop_message_nodes(msg_node, stop_node_id)[0];
            var curr_age_obj_msg = {};
            for (var n = 0; n < curr_age_messages.length; n++) {
                if (curr_age_messages.length == 1) {
                    curr_age_obj_msg["Message"] = curr_age_messages[0];
                } else {
                    curr_age_obj_msg["Message " + (n + 1)] = curr_age_messages[n];
                }
            }

            if (el.name == "Other") {
                curr_block["Other age groups"] = curr_age_obj_msg;

            } else {
                if (el.name.toLowerCase().includes("baby")) {
                    var age_name = "Baby";
                } else if (el.name.toLowerCase().includes("teen")) {
                    var age_name = "Teen";
                } else if (el.name.toLowerCase().includes("young") || el.name.toLowerCase().includes("child")) {
                    var age_name = "Young child";
                }
                curr_block[age_name] = curr_age_obj_msg;
            }
        })
        if (split_node.router.categories.length >= 3 && curr_block.hasOwnProperty("Other age groups")) {
            var cloned_other_cat = Object.assign({}, curr_block["Other age groups"]);
            delete curr_block["Other age groups"];
            if (!curr_block.hasOwnProperty("Teen")) {
                curr_block["Teen"] = cloned_other_cat;
            } else if (!curr_block.hasOwnProperty("Baby")) {
                curr_block["Baby"] = cloned_other_cat;
            } else if (!curr_block.hasOwnProperty("Young child")) {
                curr_block["Young child"] = cloned_other_cat;

            }
        }

    }
    else if (type == 2) {

        var cat_true = split_node.router.categories.filter(function (cat) { return (cat.name == "True") })[0];
        var msg_node_id = split_node.exits.filter(function (ex) { return (ex.uuid == cat_true.exit_uuid) })[0].destination_uuid;
        msg_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == msg_node_id) })[0];
        var age_string = split_node.router.operand.replace("@fields.parent_", "");
        curr_block["Message for " + age_string] = msg_node.actions[0].text;
        curr_block["Message for other age groups"] = "none";
        next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == msg_node.exits[0].destination_uuid) })[0];

    }
    else if (type == 3) {
        var next_node = {};
        split_node.router.categories.forEach(el => {
            var msg_node_id = split_node.exits.filter(function (ex) { return (ex.uuid == el.exit_uuid) })[0].destination_uuid;
            msg_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == msg_node_id) })[0];
            if (el.name == "Other") {
                curr_block["Message for other age groups"] = msg_node.actions[0].text;
            } else {
                curr_block["Message for " + el.name] = msg_node.actions[0].text;
            }


            next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == msg_node.exits[0].destination_uuid) })[0];
        })

    }
    else if (type == 4) {

    }

    curr_block["Technical info"] = {};
    curr_block["Technical info"]["Variable"] = split_node.router.operand;
    curr_block["Technical info"]["Type of split"] = type.toString();

    flow_content["Based on age group"] = curr_block;
    return next_node
}




///////////////////////////////////////////////////////////////////////////
/// multiple choice WFR note


function create_multiple_choice_block(curr_node) {
    var curr_block = {};

    var messages_and_question = loop_message_nodes(curr_node, "null");
    var messages_to_send = messages_and_question[0];
    var wfr_node = messages_and_question[1];
    var question_node = messages_and_question[2];
    messages_to_send.push(question_node.actions[0].text);

    for (var n = 0; n < messages_to_send.length; n++) {
        if (messages_to_send.length == 1) {
            curr_block["Message"] = messages_to_send[0];
        } else {
            curr_block["Message " + (n + 1)] = messages_to_send[n];
        }
    }

    var options = question_node.actions[0].quick_replies;

    for (var op = 0; op < option.length; op++) {
        var curr_option = {};
        curr_block["Option " + op + 1 + ": " + options[op]] = curr_option;
    }

    var nodes_ids_options = [];

    options.forEach(opt => {
        for (var c = 0; c < wfr_node.router.cases.length; c++) {
            if (wfr_node.router.cases[c].type == "has_any_word") {

                arg_list = wfr_node.router.cases[c].arguments[0].split(/[\s,]+/).filter(function (i) { return i });
                old_test = arg_list.join(",") + ",";
                new_test = arg_list.join(",") + ",";

                for (var ar = 0; ar < arg_list.length; ar++) {

                    arg = arg_list[ar];
                    r_exp = new RegExp(`\\b${arg}\\b`, "i");

                    for (var qr = 0; qr < options.length; qr++) {
                        quick_reply = options[qr];

                        if (r_exp.test(quick_reply)) {
                            var corr_cat_id = wfr_node.router.cases[c].category_uuid;
                            var corr_cat = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == corr_cat_id) })[0];

                            nodes_ids_options.push(wfr_node.exits.filter(function (ex) { return (ex.uuid == corr_cat.exit_uuid) })[0].destination_uuid);

                        }
                    }
                }



            }
            else { console.log("other test") }
        }
    });
    var next_node = null;
    nodes_ids_options = [...new Set(nodes_ids_options)];
    var next_nodes_ids = nodes_ids_options;
    console.log(nodes_ids_options)
    var distinct_next_nodes_ids = next_nodes_ids;

    while (distinct_next_nodes_ids.length == next_nodes_ids.length && next_nodes_ids.filter(function (id) { return (id == null) }).length == 0) {

        curr_nodes_ids = next_nodes_ids;
        next_nodes_ids = [];
        curr_nodes_ids.forEach(id => {
            next_nodes_ids.push(curr_flow.nodes.filter(function (nd) { return (nd.uuid == id) })[0].exits[0].destination_uuid);
        })
        distinct_next_nodes_ids = [...new Set(next_nodes_ids)];
    }

    if (next_nodes_ids.filter(function (id) { return (id == null) }).length != 0) {
        stop_node_id = "null"
    } else {
        var count = next_nodes_ids =>
            next_nodes_ids.reduce((a, b) => ({
                ...a,
                [b]: (a[b] || 0) + 1
            }), {}) // don't forget to initialize the accumulator

        var duplicates = dict =>
            Object.keys(dict).filter((a) => dict[a] > 1)

        stop_node_id = duplicates(count(next_nodes_ids));
        next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == stop_node_id) })[0];
    }

    nodes_ids_options.forEach(opt_node => {


    })

    flow_content["Multiple choice"] = curr_block;

    return next_node

}