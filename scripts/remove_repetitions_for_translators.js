var fs = require('fs');
var path = require("path");
// var input_path = path.join(__dirname, "../products/virtual-maths-camp/development/file_for_translation_idems-vmc.json");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/translation/eng/file_for_translation_plh_master_activity.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);


var new_file = [];

var word_count = 0; 
var bit_types = ["text","quick_replies","arguments"];
var new_bit = {};

bit_types.forEach((type) =>{
    var obj_filtered = obj.filter(function (atom) { return (atom.bit_type == type) });
    
    var distinct_text = [... new Set(obj_filtered.map(x => {if (type == "arguments") {return x.text.toLowerCase()  }else {return x.text}}))];
    
    distinct_text.forEach((unique_string) =>{
       var obj_same_text = obj_filtered.filter(function(atom) {return (atom.text == unique_string)});
       new_bit.SourceText = unique_string;
       new_bit.text = unique_string;
       new_bit.type = type;
       if (obj_same_text[0].hasOwnProperty('note')){new_bit.note = obj_same_text[0].note};
       new_file.push(Object.assign({}, new_bit));
       word_count = word_count + unique_string.split(" ").length;
    })

});








console.log(word_count)

new_file = JSON.stringify(new_file, null, 2);

output_path = path.join(__dirname, "../products/covid-19-parenting/development//translation/eng/test_rep.json");
fs.writeFile(output_path, new_file, function (err, result) {
    if (err) console.log('error', err);
});