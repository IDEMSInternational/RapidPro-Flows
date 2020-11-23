var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "./shared_folders//folders_IDs.json");
var json_string = fs.readFileSync(input_path).toString();
var folders_IDs = JSON.parse(json_string);

var external_folders_urls = {};

for (var fld in folders_IDs){
    if (fld == "ParenText"){
        continue
    } else{
    var folder_path = fld.slice(0,-3);
    var folder_list = folder_path.split(" - ");
    if (folder_list.length == 1){
        external_folders_urls[folder_list[0] + " folder"] = "https://drive.google.com/drive/folders/"+ folders_IDs[fld]
    }

    }
}




external_folders_urls = JSON.stringify(external_folders_urls, null, 2);
var output_path = path.join(__dirname, "./shared_folders//external_folders_urls.json");
fs.writeFile(output_path, external_folders_urls, function (err, result) {
    if (err) console.log('error', err);
});