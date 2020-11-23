var fs = require('fs');
var path = require("path");
// var input_path = path.join(__dirname, "../products/virtual-maths-camp/development/idems-vmc.json");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/plh_master_alphabetical.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);



var names = "";


for (var fl = 0; fl < obj.flows.length; fl++) {
    names += obj.flows[fl].name + "\n";
};

var output_path = path.join(__dirname, "../products/covid-19-parenting/development/flows_names.txt");
    fs.writeFile(output_path, names, function (err, result) {
        if (err) console.log('error', err);
    });