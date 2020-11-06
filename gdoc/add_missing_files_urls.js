var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "./files_urls.json");
var json_string = fs.readFileSync(input_path).toString();
var files_urls = JSON.parse(json_string);

for (file in files_urls) {
    if (file == "Welcome - Welcome") {
        Object.defineProperty(files_urls, "Welcome",
            Object.getOwnPropertyDescriptor(files_urls, "Welcome - Welcome"));
        delete files_urls["Welcome - Welcome"];
    }
    else if (file == "Help - Help") {
        Object.defineProperty(files_urls, "Help",
            Object.getOwnPropertyDescriptor(files_urls, "Help - Help"));
        delete files_urls["Help - Help"];
    }
    else if (file == "Help - Settings - Settings") {
        Object.defineProperty(files_urls, "Help - Settings",
            Object.getOwnPropertyDescriptor(files_urls, "Help - Settings - Settings"));
        delete files_urls["Help - Settings - Settings"];

    }
}

files_urls["Supportive - Covid"] = files_urls["Supportive - Other"];
files_urls["Supportive - Development"] = files_urls["Supportive - Other"];
files_urls["Supportive - Disabilities"] = files_urls["Supportive - Other"];
files_urls["Supportive - Family"] = files_urls["Supportive - Other"];
files_urls["Supportive - Help reminder"] = files_urls["Supportive - Other"];
files_urls["Supportive - Share"] = files_urls["Supportive - Other"];
files_urls["Supportive - Activities"] = files_urls["Supportive - Other"];
files_urls["Supportive - Activities for babies"] = files_urls["Supportive - Other"];
files_urls["Supportive - Behave reminder"] = files_urls["Supportive - Other"];
files_urls["Supportive - Children reminder"] = files_urls["Supportive - Other"];




new_urls = JSON.stringify(files_urls, null, 2);
var output_path = path.join(__dirname, "./files_urls_with_incorporated.json");
fs.writeFile(output_path, new_urls, function (err, result) {
    if (err) console.log('error', err);
});