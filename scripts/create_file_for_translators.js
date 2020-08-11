var fs = require('fs');
var path = require("path");
// var input_path = path.join(__dirname, "../products/virtual-maths-camp/development/file_for_translation_idems-vmc.json");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/translation/eng/intermediary-files/file_for_translation_plh_master.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var output_path;

var atom_to_translate = {};

var fl;
var key_bit;
var new_file = [];
var localization;
var bit;
var i;
var qr;
var word_count = 0;
var count = 1;


for (fl in obj) {
    if (!obj[fl].name.startsWith("PLH - Activity") ){
        break;
    }
    localization = obj[fl].localization.eng;
    for (key_bit in localization) {
        bit = localization[key_bit];
        if (bit.hasOwnProperty('text')) {
            lines = bit.text[0].split("\n");
            atom_to_translate = {};
            atom_to_translate.has_extraline = 0;
            for (i = 0; i < lines.length; i++) {
                if (lines[i] == "") {
                    atom_to_translate.has_extraline++;
                }
                else {
                    atom_to_translate.flow_id = fl;
                    atom_to_translate.bit_id = key_bit;
                    atom_to_translate.bit_type = "text";
                    atom_to_translate.type_id = i;
                    if (lines[i].startsWith("•\t")) {
                        atom_to_translate.text = lines[i].replace("•\t", "");
                        atom_to_translate.has_bullet = true;
                    }
                    else {
                        atom_to_translate.text = lines[i];
                    }
                    if (lines[i].indexOf("@") > -1) {
                        atom_to_translate.note = "Strings like @fields.xxx and @results.yyy should not be translated. ";
                        if (lines[i].indexOf("survey") > -1) {
                            atom_to_translate.note = atom_to_translate.note + "@fields.survey_behave_name is the name of the child";
                        }
                        if (lines[i].indexOf("count") > -1) {
                            atom_to_translate.note = atom_to_translate.note + "@results.count is a number (counter for list)";
                        }
                        if (lines[i].indexOf("skills") > -1) {
                            atom_to_translate.note = atom_to_translate.note + "@results.n_skills_week and results.n_skills are numbers";
                        }

                    }
                    atom_to_translate.word_count = word_count;
                    new_file.push(Object.assign({}, atom_to_translate));
                    word_count = word_count + atom_to_translate.text.split(" ").length;
                    atom_to_translate = {};
                    atom_to_translate.has_extraline = 0;
                }
            }
        }
        if (bit.hasOwnProperty('quick_replies')) {
            for (qr = 0; qr < bit.quick_replies.length; qr++) {
                atom_to_translate = {};
                atom_to_translate.flow_id = fl;
                atom_to_translate.bit_id = key_bit;
                atom_to_translate.bit_type = "quick_replies";
                atom_to_translate.type_id = qr;
                atom_to_translate.text = bit.quick_replies[qr];
                atom_to_translate.note = "This is a quick reply and its translation should be uniquely identified by the corresponding argument"

                atom_to_translate.word_count = word_count;
                new_file.push(Object.assign({}, atom_to_translate));
                word_count = word_count + atom_to_translate.text.split(" ").length;
            }
        }
        if (bit.hasOwnProperty('arguments')) {

            atom_to_translate = {};
            atom_to_translate.flow_id = fl;
            atom_to_translate.bit_id = key_bit;
            atom_to_translate.bit_type = "arguments";
            atom_to_translate.type_id = "0";
            atom_to_translate.text = bit.arguments[0];
            atom_to_translate.note = "This is an argument and it may be used to identify a corresponding quick reply"

            atom_to_translate.word_count = word_count;
            new_file.push(Object.assign({}, atom_to_translate));
            word_count = word_count + atom_to_translate.text.split(" ").length;
        }




    }

    if (word_count > 2000) {
        new_file = JSON.stringify(new_file, null, 2);
        //output_path = path.join(__dirname, "../products/covid-19-parenting/development/non_nested_file_for_translation_plh_master_part_" + count + ".json");
        output_path = path.join(__dirname, "../products/covid-19-parenting/development//translation/eng/file_for_translation_plh_master_activity_" + count + ".json");
        fs.writeFile(output_path, new_file, function (err, result) {
            if (err) console.log('error', err);
        });
        word_count = 0;
        new_file = [];
        count++;

    }

}


new_file = JSON.stringify(new_file, null, 2);
//output_path = path.join(__dirname, "../products/virtual-maths-camp/development/non_nested_file_for_translation_plh_master_part_" + count + ".json");
output_path = path.join(__dirname, "../products/covid-19-parenting/development//translation/eng/file_for_translation_plh_master_activity_" + count + ".json");
fs.writeFile(output_path, new_file, function (err, result) {
    if (err) console.log('error', err);
});