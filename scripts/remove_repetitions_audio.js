var fs = require('fs');
var path = require("path");
var input_path = path.join(__dirname, "../products/covid-19-parenting/development/audio-recording/eng/file_for_audio_recording_plh_masterlabel.json");
var json_string = fs.readFileSync(input_path).toString();
var audio_rec_info = JSON.parse(json_string);

var to_record = [];



var distinct_text = [... new Set(audio_rec_info.map(x => (x.text_to_read)) )];

distinct_text.forEach((unique_string) =>{
    var new_bit = {};
    new_bit.type = "audio";
    new_bit.text = unique_string;

    var obj_same_text = audio_rec_info.filter(function(atom) {return (atom.text_to_read == unique_string)});
    
    
    if (obj_same_text.length == 0){
        console.log("error with string: " + unique_string)
        
    } else if (obj_same_text.length == 1){
        new_bit.label = obj_same_text[0].label;
    } else{
        
      new_bit.label = "Common" + "_" + unique_string.split(/[\s-\n•\t,.':?!’\"“”]+/).filter(function(i){return i}).join("-");;
      new_bit.rep = obj_same_text.length; 
      for (var i = 0; i < obj_same_text.length; i++ ){
        obj_same_text[i].label = new_bit.label;
      }

    };
    
    
    to_record.push(Object.assign({}, new_bit));
    
 });




file_for_recorder = JSON.stringify(to_record, null, 2);
var output_path = path.join(__dirname, "../products/covid-19-parenting/development/audio-recording/eng/file_for_audio_recording_no_rep.json");
fs.writeFile(output_path, file_for_recorder, function (err, result) {
    if (err) console.log('error', err);
});

new_audio_rec_info = JSON.stringify(audio_rec_info, null, 2);
var output_path = path.join(__dirname, "../products/covid-19-parenting/development/audio-recording/eng/file_for_audio_recording_plh_masterlabel_new.json");
fs.writeFile(output_path, new_audio_rec_info, function (err, result) {
    if (err) console.log('error', err);
});
