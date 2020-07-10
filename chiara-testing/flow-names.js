<script>
    
let rawdata = fs.readFileSync('..\products\covid-19-parenting\malaysia-rapidpro-sandbox-for-testing2_07.json');

var rapidpro= JSON.parse(rawdata);

var i;
var names = "";
for (i = 0; i < rapidpro.flows.length; i++) {
  names += (i+1) + " " + rapidpro.flows[i].name + "<br>";
} 
document.write(names);

</script>
