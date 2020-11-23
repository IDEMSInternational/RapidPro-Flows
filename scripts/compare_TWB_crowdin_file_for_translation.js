var fs = require('fs');
var path = require("path");

var input_path_crowdin = path.join(__dirname, "../products/virtual-maths-camp/development/translation/eng/full_file_for_translation.json");
var input_path_TWB = path.join(__dirname, "../products/virtual-maths-camp/development/translation/eng/step_3_file_for_transl_no_rep.json");
var json_string_crowdin = fs.readFileSync(input_path_crowdin).toString();
var json_string_TWB = fs.readFileSync(input_path_TWB).toString();
var obj_crodwin = JSON.parse(json_string_crowdin);
var obj_TWB = JSON.parse(json_string_TWB);

var RP_to_transl = {};

obj_TWB.forEach(bit => {
    if (obj_crodwin.hasOwnProperty(bit.SourceText) || obj_crodwin.hasOwnProperty(bit.SourceText + " " ) || obj_crodwin.hasOwnProperty(bit.SourceText + "  ")){
        return
    }
    else{
        RP_to_transl[bit.SourceText] = bit.SourceText;
    }
    
});

RP_to_transl = JSON.stringify(RP_to_transl, null, 2);
var output_path = path.join(__dirname, "../products/virtual-maths-camp/development/translation/eng/RapidPro_bits_to_translate.json");
fs.writeFile(output_path, RP_to_transl, function (err, result) {
    if (err) console.log('error', err);
});
