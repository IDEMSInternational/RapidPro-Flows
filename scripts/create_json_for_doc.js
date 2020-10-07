var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);


var doc_cont = [];

var curr_flow = obj.flows.filter(function (fl) { return (fl.name == "PLH - Activity - Baby12 - Calm - Book sharing") })[0];

var curr_flow_doc = {};
var flow_info = {};
flow_info.name = curr_flow.name;
flow_info.id = curr_flow.uuid;
curr_flow_doc.flow_info = flow_info;

var flow_content = [];

var curr_node = curr_flow.nodes[0];

/*
//////////////////////////////////////////////////////////
// PLH - Content - Relax - CheckIn - Loving Kindness

var block_output = create_message_block(curr_node);
flow_content.push(block_output[0]);
curr_node = block_output[1];


var block_output = create_media_block(curr_node);
flow_content.push(block_output[0]); 
curr_node = block_output[1];

var block_output = create_message_block(curr_node);
flow_content.push(block_output[0]);
///////////////////////////////////////////////////////////
*/


///////////////////////////////////////////////////////////
// PLH - Activity - Baby12 - Calm - Book sharing
var block_output = create_default_intro_block(curr_node);
flow_content.push(block_output[0]);
curr_node = block_output[1];

var block_output = create_media_block(curr_node);
flow_content.push(block_output[0]); 
curr_node = block_output[1];

var block_output = create_list_of_tips_block(curr_node);
flow_content.push(block_output[0]); 
//////////////////////////////////////////////////////////
 




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
    var r_exp = new RegExp(`\\byes\\b`, "i");
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

                        curr_block.interaction_message = message[0].text;
                        var wfr_node = next_node[0];
                        var yes_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp.test(ca.arguments[0])) })[0].category_uuid;
                        var yes_categ = wft_node.router.categories.filter(function (cat) { return (cat.uuid == yes_categ_id) })[0];
                        var yes_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == yes_categ.exit_uuid) })[0].destination_uuid;
                        var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];
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

    return [curr_block, next_node]


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



    return [curr_block, next_node]
}


////////////////////////////////////////////////////////////
// Default intro block

function create_default_intro_block(split_node) {
    var r_exp = new RegExp(`\\byes\\b`, "i");
    var curr_block = {};
    curr_block.block_type = "default_intro";
    curr_block.messages = [];


    var skill_cat = split_node.router.categories.filter(function (cat) { return (cat.name == "Other") })[0];
    var skill_node_id = split_node.exits.filter(function (ex) { return (ex.uuid == skill_cat.exit_uuid) })[0].destination_uuid;
    var skill_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == skill_node_id) })[0];
    var toolkit_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == skill_node.exits[0].destination_uuid) })[0];
    var curr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == toolkit_node.exits[0].destination_uuid) })[0];


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
                        var yes_categ_id = wfr_node.router.cases.filter(function (ca) { return (r_exp.test(ca.arguments[0])) })[0].category_uuid;
                        var yes_categ = wfr_node.router.categories.filter(function (cat) { return (cat.uuid == yes_categ_id) })[0];
                        var yes_node_id = wfr_node.exits.filter(function (ex) { return (ex.uuid == yes_categ.exit_uuid) })[0].destination_uuid;
                        var next_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == yes_node_id) })[0];
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

    return [curr_block, next_node]


}

function create_list_of_tips_block(toolkit_node) {
    var r_exp = new RegExp(`\\bn\\b`, "i");
    var curr_block = {};
    curr_block.block_type = "list_of_tips";
    curr_block.options = [];

    var curr_node = curr_flow.nodes.filter(function (nd) { return (nd.uuid == toolkit_node.exits[0].destination_uuid) })[0];
     
    var parts_of_text = curr_node.actions[0].text.split("1. ");
    curr_block.message = parts_of_text[0];
    var tips = parts_of_text[1].split("\n").filter(function(i){return i});
    tips.pop();
    
    

next_node=null;
    return [curr_block, next_node]

}