var fs = require('fs');
var path = require("path");

var input_path_new = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var input_path_old = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");

var output_path = path.join(__dirname, "../products/covid-19-parenting/development/debug_qr.txt");

var identifiers = ["sourceText","topicTitle"];
var key_value = "text";


compare_json_files(input_path_new, input_path_old,output_path,identifiers);

function compare_json_files(input_path_new, input_path_old,output_path,identifiers){

    var json_string_old = fs.readFileSync(input_path_old).toString();
    var array_old = JSON.parse(json_string_old);
    var json_string_new = fs.readFileSync(input_path_new).toString();
    var array_new = JSON.parse(json_string_new);
    
    var changes = [];

    for (let curr_new_obj of array_new){
        var same_obj = array_old.filter(function (curr_old_obj) { 
            for (let key of identifiers) {
                if (curr_new_obj[key] !== curr_old_obj[key]) {
                  return false;
                }
            }
                return true; });
        if (same_obj.length == 0){
            changes.push(Object.assign({}, curr_new_obj));
        } else if (same_obj.length == 1){
            if (!same_obj[0][key_value] == curr_new_obj[key_value]){
                changes.push(Object.assign({}, curr_new_obj)); 
            }

        } else {console.log("multiple correspondence")}
    }

    
    changes = JSON.stringify(changes, null, 2);
    fs.writeFile(output_path, changes, function (err, result) {
        if (err) console.log('error', err);
    });
    
}
