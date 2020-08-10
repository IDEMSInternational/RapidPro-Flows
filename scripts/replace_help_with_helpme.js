var fs = require('fs');
var path = require("path");

var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master.json");
var json_string = fs.readFileSync(input_path).toString();

json_string = json_string.replace(/\\\"Help\\\"/gi,'\\"HelpMe\\"');



var output_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_helpme.json");
    fs.writeFile(output_path, json_string, function (err, result) {
        if (err) console.log('error', err);
    });