var fs = require('fs');
var path = require("path");



var input_path_original_flows = path.join(__dirname, "../gdoc/shared_folders/Philippines/original_version/plh_master.json");
var json_string_or_fl = fs.readFileSync(input_path_original_flows).toString();
var original_flows_full_json = JSON.parse(json_string_or_fl);

//create json only with activities
var original_flows = original_flows_full_json.flows.filter(function (fl) { return fl.name.toLowerCase().includes("activity") });


const directoryPath = path.join(__dirname, '../gdoc/shared_folders/Philippines/reviewed_version/JSON_files/intermediary_json/activities');

var file_names = fs.readdirSync(directoryPath);

for (var f=0; f< file_names.length; f++){
    var json_file_name = file_names[f];
    console.log(json_file_name)
    var input_path = directoryPath + "/" + json_file_name;
    var json_string = fs.readFileSync(input_path).toString();
    var int_json = JSON.parse(json_string);

    for (key in int_json){

        if (int_json[key]["Technical information"].hasOwnProperty("Template_type")){
            var type_of_template = int_json[key]["Technical information"]["Template_type"];
        }
        else if (int_json[key]["Technical information"].hasOwnProperty("Template type")){
            var type_of_template = int_json[key]["Technical information"]["Template type"];
        }

        
        var int_json_content = int_json[key]["Content"];

        if (int_json[key]["Technical information"].hasOwnProperty("Id")){
            var curr_flow_id = [int_json[key]["Technical information"]["Id"]];
        }
        else if (int_json[key]["Technical information"].hasOwnProperty("Id")){
            var curr_flow_id = [int_json[key]["Technical information"]["Id tip"], int_json[key]["Technical information"]["Id intro"]] ;
        }
       
    }

    
    var n_mess_block = 0;
    var curr_flow = original_flows.filter(function (fl) { return (fl.uuid == curr_flow_id[0]) })[0];
    var curr_node = curr_flow.nodes[0];
    update_template(int_json_content, type_of_template, curr_node)

    if (curr_flow_id.length == 2){
        var n_mess_block = 0;
        var curr_flow = original_flows.flows.filter(function (fl) { return (fl.uuid == curr_flow_id[1]) })[0];
        var curr_node = curr_flow.nodes[0];
        update_template(int_json_content, 5, curr_node)
    }


}

original_flows_full_json.flows = original_flows;
original_flows_full_json.triggers = [];
original_flows_full_json.campaigns = [];
original_flows_full_json.groups = [];

// write output
var updated_flows = JSON.stringify(original_flows_full_json, null, 2);
var output_path = path.join(__dirname, '../gdoc/shared_folders/Philippines/reviewed_version/plh_master_activities.json');
fs.writeFile(output_path, updated_flows, function (err, result) {
    if (err) console.log('error', err);
});



////////////////////////////////////////////////////////////////////////
/// FUNCTIONS /////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////
// Templates
///////////////////////////////////////////////////////////////
function update_template(int_json_content, type_of_template, curr_node) {
    if (type_of_template == 1) {
        update_template_1(int_json_content, curr_node)
    }
    else if (type_of_template == 2) {
        update_template_2(int_json_content, curr_node)
    }
    else if (type_of_template == 3) {
        update_template_3(int_json_content, curr_node)
    }
    else if (type_of_template == 4) {
        update_template_4(int_json_content, curr_node)
    }
    else if (type_of_template == 5) {
        update_template_5(int_json_content, curr_node)
    }
    else if (type_of_template == 6) {
        update_template_6(int_json_content, curr_node)
    }
    else if (type_of_template == 7) {
        update_template_7(int_json_content, curr_node)
    }
    else if (type_of_template == 8) {
        update_template_8(int_json_content, curr_node)
    }
    else if (type_of_template == 9) {
        update_template_9(int_json_content, curr_node)
    } else if (type_of_template == 10) {
        update_template_10(int_json_content, curr_node)
    } else if (type_of_template == 11) {
        update_template_11(int_json_content, curr_node)
    }
    else {
        error("template not recognised")
    }


}

///////////////////////////////////////////////////////
// Template 1 - send messages

function update_template_1(int_json_content, curr_node) {
    update_message_block(int_json_content, curr_node);
}

/////////////////////////////////////////////////////////
// Template 2 - theme split , video & list

function update_template_2(int_json_content, curr_node) {
    var block_output = update_default_intro_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_media_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_list_of_tips_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_message_block(int_json_content, curr_node);

}

//////////////////////////////////////////////////////
// Template 3 - 

function update_template_3(int_json_content, int_json_content, curr_node) {
    var block_output = update_message_block(int_json_content, int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_media_block(int_json_content, int_json_content, curr_node);
    curr_node = block_output;

    block_output = update_message_block(int_json_content, int_json_content, curr_node);

}

///////////////////////////////////////////////////////////
// Template 4

function update_template_4(int_json_content, curr_node) {
    var block_output = update_default_intro_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_media_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_message_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_list_of_tips_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_message_block(int_json_content, curr_node);

}

//////////////////////////////////////////////////////////////////////
// Template 5
function update_template_5(int_json_content, curr_node) {
    update_intro_for_timed_block(int_json_content, curr_node)
}

///////////////////////////////////////////////////////////////////////
// Template  6

function update_template_6(int_json_content, curr_node) {
    var block_output = update_default_intro_block(int_json_content, curr_node);
    curr_node = block_output;

    var block_output = update_media_block(int_json_content, curr_node);
    curr_node = block_output;

    var block_output = update_message_block(int_json_content, curr_node);

}


//////////////////////////////////////////////////////////
// Template 7

function update_template_7(int_json_content, curr_node) {
    var block_output = update_default_intro_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_media_block(int_json_content, curr_node);
    curr_node = block_output;

    block_output = update_age_split_block(int_json_content, curr_node, 1);
    curr_node = block_output;



    block_output = update_list_of_tips_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_message_block(int_json_content, curr_node);

}

///////////////////////////////////////////////////////
// Template 8

function update_template_8(int_json_content, curr_node) {
    var block_output = update_default_intro_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_media_block(int_json_content, curr_node);
    curr_node = block_output;

    block_output = update_message_block(int_json_content, curr_node);
    curr_node = block_output;


    block_output = update_age_split_block(int_json_content, curr_node, 2);
    curr_node = block_output;


    block_output = update_message_block(int_json_content, curr_node);

}
///////////////////////////////////////////////////////
// Template 9

function update_template_9(int_json_content, curr_node) {
    var block_output = update_message_block(int_json_content, curr_node);
    curr_node = block_output;

    block_output = update_age_split_block(int_json_content, curr_node, 2);
    curr_node = block_output;

    block_output = update_message_block(int_json_content, curr_node);

}

///////////////////////////////////////////////////////
// Template 10

function update_template_10(int_json_content, curr_node) {
    var block_output = update_age_split_block(int_json_content, curr_node, 1);
    curr_node = block_output;

}
/////////////////////////////////////////////////////////
// Template 11

function update_template_11(int_json_content, curr_node) {
    var block_output = update_default_intro_block(int_json_content, curr_node);
    curr_node = block_output;

    block_output = update_media_block(int_json_content, curr_node);
    curr_node = block_output;

    block_output = update_multiple_choice_block(int_json_content, curr_node);
    curr_node = block_output;

    block_output = update_message_block(int_json_content, curr_node);

}


/////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////

/////////////////////////////////// functions for generating content blocks ///////////////////////////////////////////////////////////////


////////////////////////////////////////////////
//send_messages block
function update_message_block(int_json_content, curr_node) {
    n_mess_block++;
    //console.log(n_mess_block)

    var r_exp_yes = new RegExp(`\\byes\\b`, "i");
    var r_exp_no = new RegExp(`\\bno\\b`, "i");

    var curr_block_content = int_json_content["Set of messages " + n_mess_block];
    var curr_block_messages = []
    for (msg_key in curr_block_content) {
        if (msg_key == "Interaction message") {
            break
        } else {
            curr_block_messages.push(curr_block_content[msg_key]);
        }

    }


    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {
            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) });
            if (next_node.length == 0) {
                console.log("end of flow")
                next_node = null;
                go_on = false;
                //curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") })[0].text = curr_block_messages[0]
                message[0].text = curr_block_messages[0];


            } else {
                if (next_node[0].hasOwnProperty('router')) {
                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        var ends_with_wfr = true;

                        message[0].text = curr_block_content["Interaction message"]

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

                            var curr_block_no_messages = [];
                            for (msg_key in curr_block_content) {
                                if (msg_key.startswith("Message for negative answer")) {
                                    curr_block_no_messages.push(curr_block_content[msg_key]);
                                }

                            }

                            loop_message_nodes(no_node, "null", curr_block_no_messages);
                        } else {
                            var interaction_yes_no = false;
                        }


                    } else {


                        message[0].text = curr_block_messages[0];
                        curr_block_messages.shift();
                        next_node = next_node[0];
                    }
                } else {
                    go_on = true;
                    message[0].text = curr_block_messages[0];
                    curr_block_messages.shift();
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






    if (ends_with_wfr && interaction_yes_no) {
        if (next_node.actions.filter(function (ac) { return (ac.type == "send_msg") }).length > 0) {
            next_node = create_message_block(next_node)
        }

    }



    return next_node


}

function loop_message_nodes(curr_node, stop_node_id, new_messages) {
    var messages_to_send = [];
    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {
            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) });
            if (next_node.length == 0) {
                console.log("end of flow")
                next_node = null;
                go_on = false;
                message[0].text = new_messages[0];

            } else {
                if (next_node[0].hasOwnProperty('router')) {
                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        console.log("ended in interaction node")
                        next_node = next_node[0];


                    } else {

                        message[0].text = new_messages[0];
                        new_messages.shift();
                        next_node = next_node[0];
                    }
                } else {
                    if (next_node[0].uuid == stop_node_id) {
                        go_on = false;
                        message[0].text = new_messages[0];
                        next_node = next_node[0];

                    } else {
                        go_on = true;
                        message[0].text = new_messages[0];
                        new_messages.shift();
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




//////////////////////////////////////////
// media block 
function update_media_block(int_json_content, curr_node) {

    var next_node = null;

    var curr_block_content = int_json_content["Media"];

    if (curr_node.hasOwnProperty('router') && curr_node.router.operand == "@fields.type_of_media") {
        if (curr_node.router.cases.length == 1) {
            if (curr_node.router.cases[0].arguments[0] == "high") {

                var video_category = curr_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase() == "high") })[0];
                var video_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == video_category.exit_uuid) })[0].destination_uuid;
                var video_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == video_node_id) })[0];

                var other_category = curr_node.router.categories.filter(function (cat) { return (cat.name == "Other") })[0];
                var next_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == other_category.exit_uuid) })[0].destination_uuid;
                next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node_id) })[0];

                video_node.actions[0].text = curr_block_content["Video"]["Text"];

            } else if (curr_node.router.cases[0].arguments[0] == "low") {
                //for relax audio 

            } else {
                console.log("1 argument but not high or low")
            }
        } else if (curr_node.router.cases.length == 2) {
            var video_category = curr_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase() == "high") })[0];
            var video_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == video_category.exit_uuid) })[0].destination_uuid;

            var video_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == video_node_id) })[0];
            video_node.actions[0].text = curr_block_content["Video"]["Text"];


            var audio_category = curr_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase() == "medium") })[0];
            var audio_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == audio_category.exit_uuid) })[0].destination_uuid;
            var audio_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == audio_node_id) })[0];

            audio_node.actions[0].text = curr_block_content["Audio"]["Text"];

            next_node_id = audio_node.exits[0].destination_uuid;
            next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node_id) })[0];


            var low_category = curr_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase() == "other") })[0];
            var low_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == low_category.exit_uuid) })[0].destination_uuid;

            var low_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == low_node_id) })[0];


            var low_text_version = [];
            for (msg_key in curr_block_content["Low media text option"]) {
                low_text_version.push(curr_block_content["Low media text option"][msg_key]);

            }


            nodes_text_version = loop_message_nodes(low_node, next_node_id, low_text_version);
            if (nodes_text_version[1].uuid != next_node_id) {
                console.log("error, the media split does not rejoin")
            }




        }
        else { console.log("too many arguments") }


    } else {
        console.log("error, there is no media split")
    }



    return next_node
}


//////////////////////////////////////////////////////////////
// Intro for timed

function update_intro_for_timed_block(int_json_content, skill_node) {
    var r_exp_yes = new RegExp(`\\byes\\b`, "i");
    var r_exp_no = new RegExp(`\\bno\\b`, "i");

    var curr_block_content = int_json_content["Introduction for timed content"];
    var curr_block_messages = []
    for (msg_key in curr_block_content) {
        if (msg_key == "Interaction message") {
            break
        } else {
            curr_block_messages.push(curr_block_content[msg_key]);
        }

    }



    var toolkit_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == skill_node.exits[0].destination_uuid) })[0];
    var curr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == toolkit_node.exits[0].destination_uuid) })[0];

    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {
            message[0].text = curr_block_messages[0];
            curr_block_messages.shift();

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
                        not_compl_node.actions[0].text = curr_block_content["Interaction message"];

                        var already_compl_cat = next_node[0].router.categories.filter(function (cat) { return (cat.name != "Other") })[0];
                        var already_compl_id = next_node[0].exits.filter(function (ex) { return (ex.uuid == already_compl_cat.exit_uuid) })[0].destination_uuid;

                        var already_compl_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == already_compl_id) })[0];
                        already_compl_node.actions[0].text = curr_block_content["Interaction message if already completed"];

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

    var new_no_messages = [];
    for (msg_key in curr_block_content) {
        if (msg_key.startsWith("Message for negative answer")) {
            new_no_messages.push(curr_block_content[msg_key]);
        }

    }

    loop_message_nodes(no_node, "null", new_no_messages);


}



////////////////////////////////////////////////////////////
// Default intro block

function update_default_intro_block(int_json_content, skill_node) {
    var r_exp_yes = new RegExp(`\\byes\\b`, "i");
    var r_exp_no = new RegExp(`\\bno\\b`, "i");

    var curr_block_content = int_json_content["Default introduction"];
    var curr_block_messages = []
    for (msg_key in curr_block_content) {
        if (msg_key == "Interaction message") {
            break
        } else {
            curr_block_messages.push(curr_block_content[msg_key]);
        }

    }



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
                message[0].text = curr_block_messages[0];

            } else {
                if (next_node[0].hasOwnProperty('router')) {

                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        message[0].text = curr_block_content["Interaction message"];
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


                        var new_no_messages = [];
                        for (msg_key in curr_block_content) {
                            if (msg_key.startsWith("Message for negative answer")) {
                                new_no_messages.push(curr_block_content[msg_key]);
                            }

                        }
                        loop_message_nodes(no_node, "null", new_no_messages)[0];

                    } else {

                        message[0].text = curr_block_messages[0];
                        curr_block_messages.shift();
                        next_node = next_node[0];
                    }
                } else {
                    go_on = true;
                    message[0].text = curr_block_messages[0];
                    curr_block_messages.shift();
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



    return next_node


}


/////////////////////////////////////////////////////////////
// List of tips

function update_list_of_tips_block(int_json_content, toolkit_node) {
    var r_exp = new RegExp(`\\bn\\b`, "i");
    var curr_block_content = int_json_content["List of tips"];


    var curr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == toolkit_node.exits[0].destination_uuid) })[0];
    var new_message = curr_block_content["Message"];

    var count = 0;
    for (key in curr_block_content) {
        if (key.startsWith("Option")) {
            count++;
            var tip = key.slice(10);
            new_message = new_message + count + ". " + tip + "\n";
        }
    }
    var last_sentence = curr_node.actions[0].text.split("\n").filter(function (i) { return i });
    last_sentence = last_sentence[last_sentence.length - 1];
    new_message = new_message + "\n" + last_sentence;

    curr_node.actions[0].text = new_message;


    var wfr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) })[0];

    for (var t = 1; t <= count; t++) {
        var r_exp_tip = new RegExp(`\\b${t}\\b`, "i");

        var curr_opt_messages = [];
        for (opt_key in curr_block_content) {
            if (opt_key.startsWith("Option " + t)) {
                for (msg_key in curr_block_content[opt_key]) {
                    curr_opt_messages.push(curr_block_content[opt_key][msg_key]);
                }
            }
        }

        var tip_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_tip.test(ca.arguments[0])) })[0].category_uuid;
        var tip_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == tip_categ_id) })[0];
        var tip_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == tip_categ.exit_uuid) })[0].destination_uuid;
        var tip_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == tip_node_id) })[0];
        tip_node.actions[0].text = curr_opt_messages[0];
        curr_opt_messages.shift();

        var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == tip_node.exits[0].destination_uuid) })[0];

        while (!next_node.actions[0].text.startsWith("Please select another number")) {
            next_node.actions[0].text = curr_opt_messages[0];
            curr_opt_messages.shift();
            next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node.exits[0].destination_uuid) })[0];


        }


    }

    var new_message_another = curr_block_content["Message for choosing another tip"];

    var count = 0;
    for (key in curr_block_content) {
        if (key.startsWith("Option")) {
            count++;
            var tip = key.slice(10);
            new_message_another = new_message_another + count + ". " + tip + "\n";
        }
    }

    var last_sentence_another = next_node.actions[0].text.split("\n").filter(function (i) { return i });
    last_sentence_another = last_sentence_another[last_sentence_another.length - 1];
    new_message_another = new_message_another + "\n" + last_sentence_another;

    next_node.actions[0].text = new_message_another;



    var new_node_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp.test(ca.arguments[0])) })[0].category_uuid;
    var new_node_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == new_node_categ_id) })[0];
    var new_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == new_node_categ.exit_uuid) })[0].destination_uuid;
    var new_block_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == new_node_id) })[0];



    return new_block_node

}


/////////////////////////////////////////////////////////////////////
// age splits
function update_age_split_block(int_json_content, split_node, type) {

    //if (!split_node.hasOwnProperty('router') || split_node.router.type != "switch" || !(split_node.router.operand == "@fields.age_group_for_tips" || split_node.router.operand == "@fields.chosen_difficult_age" || split_node.router.operand == "parent_baby" || split_node.router.operand == "parent_young_child" || split_node.router.operand == "parent_teenager")) {
    //    error("the first node is not a split by age")
    //}

    var curr_block_content = int_json_content["Based on age group"];


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




        for (var i = 0; i < split_node.router.categories.length; i++) {
            el = split_node.router.categories[i];


            var new_curr_age_msgs = [];
            if (el.name == "Other") {
                if (curr_block_content.hasOwnProperty("Other age groups")) {
                    for (msg_key in curr_block_content["Other age groups"]) {
                        new_curr_age_msgs.push(curr_block_content["Other age groups"][msg_key]);

                    }


                } else {
                    if (split_node.router.categories.filter(function (cat) { return cat.name.toLowerCase().includes("teen") }).length == 0) {
                        for (msg_key in curr_block_content["Teen"]) {
                            new_curr_age_msgs.push(curr_block_content["Teen"][msg_key]);

                        }
                    } else if (split_node.router.categories.filter(function (cat) { return cat.name.toLowerCase().includes("baby") }).length == 0) {
                        for (msg_key in curr_block_content["Baby"]) {
                            new_curr_age_msgs.push(curr_block_content["Baby"][msg_key]);

                        }
                    } else if (split_node.router.categories.filter(function (cat) { return (cat.name.toLowerCase().includes("young") || cat.name.toLowerCase().includes("child")) }).length == 0) {
                        for (msg_key in curr_block_content["Young child"]) {
                            new_curr_age_msgs.push(curr_block_content["Young child"][msg_key]);

                        }
                    }

                }



            } else {
                if (el.name.toLowerCase().includes("baby")) {
                    var age_name = "Baby";
                } else if (el.name.toLowerCase().includes("teen")) {
                    var age_name = "Teen";
                } else if (el.name.toLowerCase().includes("young") || el.name.toLowerCase().includes("child")) {
                    var age_name = "Young child";
                }
                if (curr_block_content.hasOwnProperty(age_name)) {
                    for (msg_key in curr_block_content[age_name]) {
                        new_curr_age_msgs.push(curr_block_content[age_name][msg_key]);
                    }

                }


            }


            var msg_node_id = split_node.exits.filter(function (ex) { return (ex.uuid == el.exit_uuid) })[0].destination_uuid;
            msg_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == msg_node_id) })[0];
            loop_message_nodes(msg_node, stop_node_id, new_curr_age_msgs);
        }




    }
    else if (type == 2) {

        var cat_true = split_node.router.categories.filter(function (cat) { return (cat.name == "True") })[0];
        var msg_node_id = split_node.exits.filter(function (ex) { return (ex.uuid == cat_true.exit_uuid) })[0].destination_uuid;
        msg_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == msg_node_id) })[0];
        var age_string = split_node.router.operand.replace("@fields.parent_", "");
        msg_node.actions[0].text = curr_block_content["Message for " + age_string];
        
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


    return next_node
}





