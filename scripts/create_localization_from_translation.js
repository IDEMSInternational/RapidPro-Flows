var fs = require('fs');
var path = require("path");

var input_path_localis = path.join(__dirname, "../products/covid-19-parenting/development/translation/eng/intermediary-files/file_for_translation_plh_master.json");
var json_string = fs.readFileSync(input_path_localis).toString();
var obj = JSON.parse(json_string);

var input_path_transl = path.join(__dirname, "../products/covid-19-parenting/development/translation/eng/file_for_translation_plh_master_activity_1.json");
var json_string = fs.readFileSync(input_path_transl).toString();
var obj_tr = JSON.parse(json_string);

var output_path;

var new_lang = "ita";

var fl;
var tx;
var qr;
var bit;
var filtered;
var new_loc;
var nl = "\n";

for (fl in obj) {
    new_loc = JSON.parse(JSON.stringify(obj[fl].localization.eng));
    obj[fl].localization[new_lang] = new_loc;
    for (bit_id in obj[fl].localization[new_lang]) {
        bit = obj[fl].localization[new_lang][bit_id];
        if (bit.hasOwnProperty('text')) {
            obj[fl].localization[new_lang][bit_id].text = [""];
            filtered = obj_tr.filter(function (atom) { return (atom.flow_id == fl && atom.bit_id == bit_id && atom.bit_type == "text") });
            filtered = filtered.sort(function (a, b) { return a.type_id - b.type_id });
            for (tx = 0; tx < filtered.length; tx++) {
                if (tx == 0) {
                    if (filtered[tx].hasOwnProperty('has_bullet') && filtered[tx].has_bullet == true){
                        obj[fl].localization[new_lang][bit_id].text[0] = obj[fl].localization[new_lang][bit_id].text[0] + "•\t" + filtered[tx].text;
                    }
                    else{
                    obj[fl].localization[new_lang][bit_id].text[0] = obj[fl].localization[new_lang][bit_id].text[0] + filtered[tx].text;
                    };
                }
                else {
                    if (filtered[tx].hasOwnProperty('has_bullet') && filtered[tx].has_bullet == true){
                        obj[fl].localization[new_lang][bit_id].text[0] = obj[fl].localization[new_lang][bit_id].text[0] + nl.repeat(filtered[tx].has_extraline+1) + "•\t" + filtered[tx].text;
                    }
                    else{
                    obj[fl].localization[new_lang][bit_id].text[0] = obj[fl].localization[new_lang][bit_id].text[0] + nl.repeat(filtered[tx].has_extraline+1) + filtered[tx].text;
                    };
                    
                }
            };


        };
        if (bit.hasOwnProperty('quick_replies')) {
            obj[fl].localization[new_lang][bit_id].quick_replies = [];
            filtered = obj_tr.filter(function (atom) { return (atom.flow_id == fl && atom.bit_id == bit_id && atom.bit_type == "quick_replies") });
            filtered = filtered.sort(function (a, b) { return a.type_id - b.type_id });
            for (qr = 0; qr < filtered.length; qr++) {
                obj[fl].localization[new_lang][bit_id].quick_replies.push(filtered[qr].text);
            }

        };
        if (bit.hasOwnProperty('arguments')) {
            obj[fl].localization[new_lang][bit_id].arguments = [];
            filtered = obj_tr.filter(function (atom) { return (atom.flow_id == fl && atom.bit_id == bit_id && atom.bit_type == "arguments") });
            if (filtered.length>0){
                obj[fl].localization[new_lang][bit_id].arguments.push(filtered[0].text);
            }else{
                console.log("no match" + obj[fl].name + "\n")
            };

        };

    };
};

new_file = JSON.stringify(obj, null, 2);
//output_path = path.join(__dirname, "../products/virtual-maths-camp/development/non_nested_file_for_translation_plh_master_part_" + count + ".json");
output_path = path.join(__dirname, "../products/covid-19-parenting/development//translation/eng/flows_with_translation.json");
fs.writeFile(output_path, new_file, function (err, result) {
    if (err) console.log('error', err);
});