var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/file_for_translation_plh_master.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var atom_to_translate = {};

var fl;
var key_bit;
new_file = "";
var localization;
var bit;
var i;


for (fl in obj) {
    localization = obj[fl].localization.eng;
    for (key_bit in localization){
        bit = localization[key_bit];
        if (bit.hasOwnProperty('text')){
            lines = bit.text[0].split("\n");
            for (i = 0; i < lines.length; i++){
                atom_to_translate = {};
                atom_to_translate.flow_id = fl;
                atom_to_translate.bit_id = key_bit;
                atom_to_translate.bit_type = "text";
                atom_to_translate.type_id = i;
                if (lines[i].startsWith("•\t")){
                    atom_to_translate.text = lines[i].replace("•\t","");
                    atom_to_translate.has_bullet = "yes";
                }
                else {
                    atom_to_translate.text = lines[i];
                    atom_to_translate.has_bullet = "no";
                }
                new_file = new_file + JSON.stringify(atom_to_translate, null, 2);
            }
        }
        



    }
    

    
}


var output_path = path.join(__dirname, "../products/covid-19-parenting/development/non_nested_file_for_translation_plh_master.json");
fs.writeFile(output_path, new_file, function (err, result) {
    if (err) console.log('error', err);
});