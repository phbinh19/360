const express = require('express');
const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/', function(req, res){
	res.sendFile('index.html', {root: __dirname});

});

console.log('Dir: ');
console.log(__dirname);

app.listen(port, ()=> console.log('Listening on port' + port));