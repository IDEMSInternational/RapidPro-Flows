var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);


var doc_cont = [];

var curr_flow = obj.flows.filter(function (fl) { return (fl.name == "PLH - Content - Extra - Behave - Problem solving") })[0];

var curr_flow_doc = {};
var flow_info = {};
flow_info.name = curr_flow.name;
flow_info.id = curr_flow.uuid;
curr_flow_doc.flow_info = flow_info;

var flow_content = [];

var curr_node = curr_flow.nodes[0];


///////////////////////////////////////////////////////
// Template 1 - send messages
// Examples: PLH - Activity - Adult11 - Calm - Give yourself a hug
/*
var block_output = create_message_block(curr_node);

*/
/////////////////////////////////////////////////////////



///////////////////////////////////////////////////////////
// Template 2 - theme split , video & list
// Example: PLH - Activity - Baby12 - Calm - Book sharing

/*
var block_output = create_default_intro_block(curr_node);
curr_node = block_output;

var block_output = create_media_block(curr_node);
curr_node = block_output;

var block_output = create_list_of_tips_block(curr_node);
curr_node = block_output;

var block_output = create_message_block(curr_node);
*/
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////
// Template 3 - 
// Example: PLH - Content - Relax - CheckIn - Loving Kindness

/*
var block_output = create_message_block(curr_node);
curr_node = block_output;


block_output = create_media_block(curr_node);
curr_node = block_output;

block_output = create_message_block(curr_node);

*/
///////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////
// Template  -
// Example: PLH - Content - Extra - Behave - Problem solving

var block_output = create_default_intro_block(curr_node);
curr_node = block_output;

var block_output = create_media_block(curr_node);
curr_node = block_output;

var block_output = create_message_block(curr_node);
//////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////


// add content to object for flow
curr_flow_doc.content = flow_content;
// add flow to list of flows for doc
doc_cont.push(curr_flow_doc);

// write output
doc_cont = JSON.stringify(doc_cont, null, 2);
var output_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_for_doc.json");
fs.writeFile(output_path, doc_cont, function (err, result) {
    if (err) console.log('error', err);
});


/////////////////////////////////// functions for generating content blocks ///////////////////////////////////////////////////////////////


////////////////////////////////////////////////
//send_messages block
function create_message_block(curr_node) {
    var r_exp_yes = new RegExp(`\\byes\\b`, "i");
    var r_exp_no = new RegExp(`\\bno\\b`, "i");
    var curr_block = {};
    curr_block.block_type = "send_messages";
    curr_block.messages = [];



    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {
            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) });
            if (next_node.length == 0) {
                console.log("fine flow")
                next_node = null;
                go_on = false;
                curr_block.messages.push(message[0].text);
            } else {
                if (next_node[0].hasOwnProperty('router')) {
                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        var ends_with_wfr = true;

                        curr_block.interaction_message = message[0].text;
                        var wfr_node = next_node[0];
                        var yes_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_yes.test(ca.arguments[0])) })[0].category_uuid;
                        var yes_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == yes_categ_id) })[0];
                        var yes_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == yes_categ.exit_uuid) })[0].destination_uuid;
                        var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];

                        var no_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_no.test(ca.arguments[0])) })[0].category_uuid;
                        var no_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == no_categ_id) })[0];
                        var no_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == no_categ.exit_uuid) })[0].destination_uuid;
                        var no_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == no_node_id) })[0];
                        
                       
                        curr_block.no_messages = loop_message_nodes(no_node)[0];



                    } else {

                        curr_block.messages.push(message[0].text);
                        next_node = next_node[0];
                    }
                } else {
                    go_on = true;
                    curr_block.messages.push(message[0].text);
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
    flow_content.push(curr_block);

    if (ends_with_wfr){
        next_node = create_message_block(next_node)
    }
    return next_node


}

function loop_message_nodes(curr_node){
    var messages_to_send = [];
    do {
        var message = curr_node.actions.filter(function (ac) { return (ac.type == "send_msg") });

        if (message.length > 0) {
            var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) });
            if (next_node.length == 0) {
                console.log("fine flow")
                next_node = null;
                go_on = false;
                messages_to_send.push(message[0].text);
            } else {
                if (next_node[0].hasOwnProperty('router')) {
                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        console.log("error: interaction node")
                        next_node = null;
                       

                    } else {

                        messages_to_send.push(message[0].text);
                        next_node = next_node[0];
                    }
                } else {
                    go_on = true;
                    messages_to_send.push(message[0].text);
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
 return [messages_to_send,next_node]
}

////////////////////////////////////////////
// media block
function create_media_block(curr_node) {

    var curr_block = {};
    var next_node = null;
    curr_block.block_type = "media";
    if (curr_node.hasOwnProperty('router') && curr_node.router.operand == "@fields.type_of_media") {
        if (curr_node.router.cases.length == 1) {
            if (curr_node.router.cases[0].arguments[0] == "high") {

                var video_category = curr_node.router.categories.filter(function (cat) { return (cat.name == "High") })[0];
                var video_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == video_category.exit_uuid) })[0].destination_uuid;
                var video_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == video_node_id) })[0];

                var other_category = curr_node.router.categories.filter(function (cat) { return (cat.name == "Other") })[0];
                var next_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == other_category.exit_uuid) })[0].destination_uuid;
                next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node_id) })[0];
                var video = {};
                video.text = video_node.actions[0].text;
                video.link = video_node.actions[0].attachments;
                curr_block.video = video;

            } else {
                console.log("1 argument but not high")
            }
        } else if (curr_node.router.cases.length == 2) {
            var video_category = curr_node.router.categories.filter(function (cat) { return (cat.name == "Other") })[0];
            var video_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == video_category.exit_uuid) })[0].destination_uuid;

            var video_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == video_node_id) })[0];
            var video = {};
            video.text = video_node.actions[0].text;
            video.link = video_node.actions[0].attachments;
            curr_block.video = video;

            var audio_category = curr_node.router.categories.filter(function (cat) { return (cat.name == "Low") })[0];
            var audio_node_id = curr_node.exits.filter(function (ex) { return (ex.uuid == audio_category.exit_uuid) })[0].destination_uuid;
            var audio_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == audio_node_id) })[0];
            var audio = {};
            audio.text = audio_node.actions[0].text;
            audio.link = audio_node.actions[0].attachments;
            curr_block.audio = audio;

            next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == audio_node.exits[0].destination_uuid) })[0];


        }
        else { console.log("too many arguments") }


    } else {
        console.log("error, there is no media split")
    }


    flow_content.push(curr_block);
    return next_node
}


////////////////////////////////////////////////////////////
// Default intro block

function create_default_intro_block(skill_node) {
    var r_exp_yes = new RegExp(`\\byes\\b`, "i");
    var r_exp_no = new RegExp(`\\bno\\b`, "i");
    var curr_block = {};
    curr_block.block_type = "default_intro";
    curr_block.messages = [];


    
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
                console.log("fine flow")
                next_node = null;
                go_on = false;
                curr_block.messages.push(message[0].text);
            } else {
                if (next_node[0].hasOwnProperty('router')) {
                    go_on = false;
                    if (next_node[0].router.operand == "@input.text") {

                        curr_block.interaction_message = message[0].text;
                        var wfr_node = next_node[0];
                        var yes_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_yes.test(ca.arguments[0])) })[0].category_uuid;
                        var yes_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == yes_categ_id) })[0];
                        var yes_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == yes_categ.exit_uuid) })[0].destination_uuid;
                        var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];

                        var no_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_no.test(ca.arguments[0])) })[0].category_uuid;
                        var no_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == no_categ_id) })[0];
                        var no_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == no_categ.exit_uuid) })[0].destination_uuid;
                        var no_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == no_node_id) })[0];
                        
                       
                        curr_block.no_messages = loop_message_nodes(no_node)[0];
                    } else {

                        curr_block.messages.push(message[0].text);
                        next_node = next_node[0];
                    }
                } else {
                    go_on = true;
                    curr_block.messages.push(message[0].text);
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
    
    flow_content.push(curr_block);
    return next_node


}

function create_list_of_tips_block(toolkit_node) {
    var r_exp = new RegExp(`\\bn\\b`, "i");
    var curr_block = {};
    curr_block.block_type = "list_of_tips";

    var curr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == toolkit_node.exits[0].destination_uuid) })[0];

    var parts_of_text = curr_node.actions[0].text.split("1. ");
    curr_block.message = parts_of_text[0];

    var tips = parts_of_text[1].split("\n").filter(function (i) { return i });
    tips.pop();

    curr_block.options = [];
    var wfr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == curr_node.exits[0].destination_uuid) })[0];

    for (var t = 0; t < tips.length; t++) {
        var r_exp_tip = new RegExp(`\\b${t + 1}\\b`, "i");
        curr_opt = {};
        if (t == 0) { curr_opt.name = tips[t] } else { curr_opt.name = tips[t].slice(3) };
        
        curr_opt.messages = [];
        var tip_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp_tip.test(ca.arguments[0])) })[0].category_uuid;
        var tip_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == tip_categ_id) })[0];
        var tip_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == tip_categ.exit_uuid) })[0].destination_uuid;
        var tip_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == tip_node_id) })[0];
        curr_opt.messages.push(tip_node.actions[0].text);
        var next_node =  curr_flow.nodes.filter(function (nd) { return (nd.uuid == tip_node.exits[0].destination_uuid) })[0];

        while(!next_node.actions[0].text.startsWith("Please select another number") ){
            curr_opt.messages.push(next_node.actions[0].text);
            next_node =  curr_flow.nodes.filter(function (nd) { return (nd.uuid == next_node.exits[0].destination_uuid) })[0];


        }


        curr_block.options.push(curr_opt);
    }

    curr_block.choose_more = next_node.actions[0].text.split("1. ")[0];


    var new_node_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp.test(ca.arguments[0])) })[0].category_uuid;
        var new_node_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == new_node_categ_id) })[0];
        var new_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == new_node_categ.exit_uuid) })[0].destination_uuid;
        var new_block_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == new_node_id) })[0];
    
    flow_content.push(curr_block);
    return new_block_node

}