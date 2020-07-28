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
var qr;


for (fl in obj) {
    localization = obj[fl].localization.eng;
    for (key_bit in localization){
        bit = localization[key_bit];
        if (bit.hasOwnProperty('text')){
            lines = bit.text[0].split("\n");
            atom_to_translate = {};
            atom_to_translate.has_extraline=0;
            for (i = 0; i < lines.length; i++){
                if (lines[i]==""){
                    atom_to_translate.has_extraline++;
                } 
                else {
                    atom_to_translate.flow_id = fl;
                    atom_to_translate.bit_id = key_bit;
                    atom_to_translate.bit_type = "text";
                    atom_to_translate.type_id = i;
                    if (lines[i].startsWith("•\t")){
                        atom_to_translate.text = lines[i].replace("•\t","");
                        atom_to_translate.has_bullet = true;
                    }
                    else {
                        atom_to_translate.text = lines[i];
                    }
                    new_file = new_file + JSON.stringify(atom_to_translate, null, 2);
                    atom_to_translate = {};
                    atom_to_translate.has_extraline=0;
                }
            }
        }
        if (bit.hasOwnProperty('quick_replies')){
            for (qr = 0; qr < bit.quick_replies.length; qr++){
                atom_to_translate = {};
                atom_to_translate.flow_id = fl;
                atom_to_translate.bit_id = key_bit;
                atom_to_translate.bit_type = "quick_replies";
                atom_to_translate.type_id = qr;
                atom_to_translate.text = bit.quick_replies[qr];
                atom_to_translate.note = "This is a quick reply and its traslation should be uniquely identified by the corresponding argument"
                
                new_file = new_file + JSON.stringify(atom_to_translate, null, 2);
            }
        }
        if (bit.hasOwnProperty('arguments')){
            
                atom_to_translate = {};
                atom_to_translate.flow_id = fl;
                atom_to_translate.bit_id = key_bit;
                atom_to_translate.bit_type = "arguments";
                atom_to_translate.type_id = "0";
                atom_to_translate.text = bit.arguments[0];
                atom_to_translate.note = "This is an argument and it may be used to identify a corresponding quick reply"
                
                new_file = new_file + JSON.stringify(atom_to_translate, null, 2);
            
        }




    }
    

    
}


var output_path = path.join(__dirname, "../products/covid-19-parenting/development/non_nested_file_for_translation_plh_master.json");
fs.writeFile(output_path, new_file, function (err, result) {
    if (err) console.log('error', err);
});