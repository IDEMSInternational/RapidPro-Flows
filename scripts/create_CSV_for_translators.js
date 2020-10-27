/*import * as fs from "fs";
import * as path from "path";
import { json2csv } from "json-2-csv";*/

var fs = require('fs');
var path = require("path");
var converter =  require("json-2-csv");

var input_path = path.join(__dirname, "../products/covid-19-parenting/development/translation/eng/step_3_file_for_transl_content.json");
var json_string = fs.readFileSync(input_path).toString();
var obj = JSON.parse(json_string);



//var rows: { SourceText: string, text: string, type: string, note: string }[] = [];
var rows = [];

obj.forEach(bit_to_transl => {
    var note = "";
    if (bit_to_transl.hasOwnProperty("note")){ note = bit_to_transl.note;
    }
    rows.push({
        SourceText: bit_to_transl.SourceText,
        text: bit_to_transl.text,
        type: bit_to_transl.type,
        note: note});
});


converter.json2csv(rows, (err, csvString) => {
    var output_path = path.join(__dirname, "../products/covid-19-parenting/development/translation/eng/step_3_file_for_transl_content.csv");
    fs.writeFileSync(output_path, csvString);
    console.log("CSV is written");
});

/*

    fs.writeFile(output_path, csvString, function (err, result) {
        if (err) console.log('error', err);
    });
*/


