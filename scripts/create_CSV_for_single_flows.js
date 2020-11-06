
var fs = require('fs');
var path = require("path");
var converter = require("json-2-csv");

var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var full_json_string = fs.readFileSync(input_path).toString();
var full_obj = JSON.parse(full_json_string);

var obj = extract_bits_to_be_translated(full_obj);




var flows_for_spreadsheet = [];

file_1 = {};
file_1.list_of_flows = ["PLH - Welcome - Entry", "PLH - Welcome - Initial registration", "PLH - Welcome - Tips"];
file_1.name_of_file = "Welcome - Welcome";
flows_for_spreadsheet.push(file_1);

file_2 = {};
file_2.list_of_flows = ["PLH - Survey - Behaviour", "PLH - Survey - Behaviour - Children age groups", "PLH - Survey - Behave - Tips for difficult behaviours"];
file_2.name_of_file = "Survey - Behaviour";
flows_for_spreadsheet.push(file_2);

file_3 = {};
file_3.list_of_flows = ["PLH - Survey - Parenting", "PLH - Survey - Parenting - Questions"];
file_3.name_of_file = "Survey - Parenting";
flows_for_spreadsheet.push(file_3);

file_4 = {};
file_4.list_of_flows = ["PLH - Survey - Parenting & Behaviour", "PLH - Survey - Parenting & Behaviour - Questions & Comparison", "PLH - Survey - Behave - Tips for difficult behaviours"];
file_4.name_of_file = "Survey - Parenting & Behaviour";
flows_for_spreadsheet.push(file_4);

file_5 = {};
file_5.list_of_flows = ["PLH - Survey - COVID19 Experience"];
file_5.name_of_file = "Survey - COVID19 Experience";
flows_for_spreadsheet.push(file_5);

file_6 = {};
file_6.list_of_flows = ["PLH - Supportive - Calm"];
file_6.name_of_file = "Supportive - Calm";
flows_for_spreadsheet.push(file_6);

file_7 = {};
file_7.list_of_flows = ["PLH - Supportive - Praise"];
file_7.name_of_file = "Supportive - Praise";
flows_for_spreadsheet.push(file_7);

file_8 = {};
file_8.list_of_flows = ["PLH - Supportive - Covid", "PLH - Supportive - Development", "PLH - Supportive - Disabilities", "PLH - Supportive - Family", "PLH - Supportive - Help reminder", "PLH - Supportive - Share", "PLH - Supportive - Activities", "PLH - Supportive - Activities for babies", "PLH - Supportive - Behave reminder", "PLH - Supportive - Children reminder"];
file_8.name_of_file = "Supportive - Other";
flows_for_spreadsheet.push(file_8);

file_9 = {};
file_9.list_of_flows = ["PLH - Supportive - Weekly congratulations"];
file_9.name_of_file = "Supportive - Weekly congratulations";
flows_for_spreadsheet.push(file_9);

file_10 = {};
file_10.list_of_flows = ["PLH - Picker - Choose difficult age","PLH - Content - Extra - Behave"];
file_10.name_of_file = "Content - Extra - Behave";
flows_for_spreadsheet.push(file_10);


file_11 = {};
file_11.list_of_flows = ["PLH - Help - Entry", "PLH - Help - Children", "PLH - Help - Settings", "PLH - Help - Stress", "PLH - Help - Access toolkit", "PLH - Internal - Print parenting toolkits"];
file_11.name_of_file = "Help - Help";
flows_for_spreadsheet.push(file_11);



file_12 = {};
file_12.list_of_flows = ["PLH - Help - Settings - Change age group for tips", "PLH - Help - Settings - Language", "PLH - Help - Settings - Leave the program", "PLH - Help - Settings - Manage information", "PLH - Help - Settings - Manage information children", "PLH - Internal - Print children age group string","PLH - Help - Settings - Manage information user", "PLH - Help - Settings - Message timing", "PLH - Help - Settings - Type of media content"];
file_12.name_of_file = "Help - Settings - Settings";
flows_for_spreadsheet.push(file_12);

file_13 = {};
file_13.list_of_flows = ["PLH - Content - Time - CheckIn - One on one time"];
file_13.name_of_file = "Content - Time - CheckIn - One on one time";
flows_for_spreadsheet.push(file_13);


file_14 = {};
file_14.list_of_flows = ["PLH - Content - Positive - CheckIn - Consequences"];
file_14.name_of_file = "Content - Positive - CheckIn - Consequences";
flows_for_spreadsheet.push(file_14);

file_15 = {};
file_15.list_of_flows = ["PLH - Content - Positive - CheckIn - Emotions"];
file_15.name_of_file = "Content - Positive - CheckIn - Emotions";
flows_for_spreadsheet.push(file_15);

file_16 = {};
file_16.list_of_flows = ["PLH - Content - Positive - CheckIn - Ignore"];
file_16.name_of_file = "Content - Positive - CheckIn - Ignore";
flows_for_spreadsheet.push(file_16);

file_17 = {};
file_17.list_of_flows = ["PLH - Content - Positive - CheckIn - Instructions"];
file_17.name_of_file = "Content - Positive - CheckIn - Instructions";
flows_for_spreadsheet.push(file_17);

file_18 = {};
file_18.list_of_flows = ["PLH - Content - Positive - CheckIn - Praise"];
file_18.name_of_file = "Content - Positive - CheckIn - Praise";
flows_for_spreadsheet.push(file_18);

file_19 = {};
file_19.list_of_flows = ["PLH - Content - Positive - CheckIn - Rules"];
file_19.name_of_file = "Content - Positive - CheckIn - Rules";
flows_for_spreadsheet.push(file_19);

file_20 = {};
file_20.list_of_flows = ["PLH - Feedback - Feedback for content","PLH - Feedback - Feedback for checkIn"];
file_20.name_of_file = "Others - Feedback";
flows_for_spreadsheet.push(file_20);


file_21 = {};
file_21.list_of_flows = ["PLH - Timed - 24h timeout alert"];
file_21.name_of_file = "Others - 24h timeout alert";
flows_for_spreadsheet.push(file_21);


file_22 = {};
file_22.list_of_flows = ["PLH - Handler - Activity","PLH - Picker - Age group for activity", "PLH - Handler - Activity - Adults", "PLH - Handler - Activity - Babies", "PLH - Handler - Activity - Teenagers","PLH - Handler - Activity - Young children"];
file_22.name_of_file = "Activity - Entries";
flows_for_spreadsheet.push(file_22);


file_23 = {};
file_23.list_of_flows = ["PLH - Content - Relax - CheckIn - Connect"];
file_23.name_of_file = "Content - Relax - CheckIn - Connect";
flows_for_spreadsheet.push(file_23);

file_24 = {};
file_24.list_of_flows = ["PLH - Content - Relax - CheckIn - List of things"];
file_24.name_of_file = "Content - Relax - CheckIn - List of things";
flows_for_spreadsheet.push(file_24);

file_25 = {};
file_25.list_of_flows = ["PLH - Content - Relax - CheckIn - Loving Kindness"];
file_25.name_of_file = "Content - Relax - CheckIn - Loving Kindness";
flows_for_spreadsheet.push(file_25);

file_26 = {};
file_26.list_of_flows = ["PLH - Content - Extra - Development"];
file_26.name_of_file = "Content - Extra - Development";
flows_for_spreadsheet.push(file_26);


/*const wrapperJson2Csv = (output_path, rows) => {
    return new Promise((resolve, reject) => {
        converter.json2csvAsync(rows)
    })
};*/

//flows_for_spreadsheet = [flows_for_spreadsheet[12]];
//console.log(flows_for_spreadsheet)

//var files_rows = [];
//var files_output_paths = [];

async function outputFiles() {


    for (var N_file = 0; N_file < flows_for_spreadsheet.length; N_file++) {
        var rows = [];
        for (var n_fl = 0; n_fl < flows_for_spreadsheet[N_file].list_of_flows.length; n_fl++) {

            for (var fl in obj) {
                if (obj[fl].name  == flows_for_spreadsheet[N_file].list_of_flows[n_fl])
                    for (var bit_id in obj[fl].localization.eng) {
                        var bit = obj[fl].localization.eng[bit_id];
                        if (bit.hasOwnProperty('text')) {
                            //var name_split = obj[fl].name.replace("PLH - ", "").split(/[\-]+/).filter(function(i){return i});
                            var name_split = obj[fl].name.replace("PLH - ", "").split(" - ").filter(function (i) { return i });
                            for (var j = name_split.length; j <= 4; j++) {
                                name_split.push("");
                            }

                            var quick_replies = [];


                            for (var i = 0; i < 10; i++) {
                                if (i < bit.quick_replies.length) {
                                    quick_replies.push(bit.quick_replies[i]);
                                }
                                else {
                                    quick_replies.push("");
                                };
                            };
                            rows.push({
                                "category": name_split[0],
                                "subcategory": name_split[1],
                                "name": name_split[2],
                                "specification": name_split[3],
                                "text message": bit.text[0],
                                "option 1": quick_replies[0],
                                "option 2": quick_replies[1],
                                "option 3": quick_replies[2],
                                "option 4": quick_replies[3],
                                "option 5": quick_replies[4],
                                "option 6": quick_replies[5],
                                "option 7": quick_replies[6],
                                "option 8": quick_replies[7],
                                "option 9": quick_replies[8],
                                "option 10": quick_replies[9],
                                "name of flow": obj[fl].name,
                                "flow id": fl,
                                "node id": bit_id,
                            });
                        };
                    };
            };
        }

        //files_rows.push(rows)
        var output_path = path.join(__dirname, "../gdoc/csv_files/" + flows_for_spreadsheet[N_file].name_of_file + ".csv");

        //files_output_paths.push(output_path)


        console.log(output_path)
        /* converter.json2csv(rows, (err, csvString) => {
            fs.writeFileSync(output_path, csvString);
            //console.log("CSV " + flows_for_spreadsheet[N_file].name_of_file + " is written");
            console.log(output_path + " is written")
        }); */
        
        let csvString = await converter.json2csvAsync(rows);
        fs.writeFileSync(output_path, csvString);
        /*wrapperJson2Csv(output_path, rows).then((csv) => {
            console.log(output_path)
            fs.writeFile(output_path, csv, function (err, result) {
                if (err) console.log('error', err);
            }
            )
        }).catch((err) => { console.error(err) });*/

    }
}
outputFiles().then(() => {
    console.log("I outputted the files");
});


// function for extracting text from flows
function extract_bits_to_be_translated(obj) {
    var bits_to_translate = {};
    var localization = {};
    var eng_localization = {};

    var word_tests = ["has_any_word", "has_all_words", "has_phrase", "has_only_phrase", "has_beginning"];



    for (var fl = 0; fl < obj.flows.length; fl++) {
        for (var n = 0; n < obj.flows[fl].nodes.length; n++) {
            for (var ac = 0; ac < obj.flows[fl].nodes[n].actions.length; ac++) {
                var curr_act = obj.flows[fl].nodes[n].actions[ac];
                if (curr_act.type == "send_msg") {
                    var msg_id = curr_act.uuid;
                    var trasl_to_add = {};
                    trasl_to_add.text = [curr_act.text];
                    trasl_to_add.quick_replies = curr_act.quick_replies;
                    eng_localization[msg_id] = trasl_to_add;
                }
            }
            if (obj.flows[fl].nodes[n].hasOwnProperty('router')) {
                if (obj.flows[fl].nodes[n].router.operand == "@input.text") {
                    for (var c = 0; c < obj.flows[fl].nodes[n].router.cases.length; c++) {
                        var curr_case = obj.flows[fl].nodes[n].router.cases[c];
                        if (word_tests.includes(curr_case.type)) {
                            var case_id = curr_case.uuid;
                            var trasl_to_add = {};
                            trasl_to_add.arguments = curr_case.arguments;
                            eng_localization[case_id] = trasl_to_add;

                        }
                    }

                }



            }
        }

        var flow_id = obj.flows[fl].uuid;
        var flow_info = {};
        flow_info.flowid = flow_id;
        flow_info.name = obj.flows[fl].name;
        localization.eng = eng_localization;
        flow_info.localization = localization;
        bits_to_translate[flow_id] = flow_info;
        localization = {};
        eng_localization = {};
    }
    return bits_to_translate;
}