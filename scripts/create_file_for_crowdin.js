var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/virtual-maths-camp/development/translation/eng/intermediary-files/intermediary_file_for_translation_idems_vmc.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);

var atom_to_translate = {};

var fl;
var key_bit;
var new_file = {};
var localization;
var bit;
var i;
var qr;
var word_count = 0;


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
                    if (lines[i].indexOf("@")>-1){
                        atom_to_translate.note = "Strings like @fields.xxx and @results.yyy should not be translated"
                    }
                    new_file[word_count] = Object.assign({}, atom_to_translate);
                    word_count = word_count + atom_to_translate.text.split(" ").length;
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
                
                new_file[word_count] = Object.assign({}, atom_to_translate);
                word_count = word_count + atom_to_translate.text.split(" ").length;
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
                
                new_file[word_count] = Object.assign({}, atom_to_translate);
                word_count = word_count + atom_to_translate.text.split(" ").length;
        }




    }
    

    
}

non_nested_file = JSON.stringify(new_file, null, 2);
var output_path = path.join(__dirname, "../products/virtual-maths-camp/development/translation/eng/intermediary-files/non_nested_file_for_translation_idems_vmc.json");
fs.writeFile(output_path, non_nested_file, function (err, result) {
    if (err) console.log('error', err);
});


var crowdin_file = {};
for (el in new_file){
    crowdin_file[el] = new_file[el].text;
}

crowdin_file = JSON.stringify(crowdin_file, null, 2);
var output_path = path.join(__dirname, "../products/virtual-maths-camp/development/translation/eng/translation_idems_vmc.json");
fs.writeFile(output_path, crowdin_file, function (err, result) {
    if (err) console.log('error', err);
});
