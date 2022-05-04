var express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
var app = express();

app.use(cors());

app.use(express.static('public'));

//CORS
app.all("/*", (req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
   res.header(
       "Access-Control-Allow-Headers",
       "Origin, X-Requested-With, Content-Type, Accept"
   );
   next();
});

/*
// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
   console.log("Got a GET request for the homepage");
   res.send('Hello GET');
})

// This responds a POST request for the homepage
app.post('/', function (req, res) {
   console.log("Got a POST request for the homepage");
   res.send('Hello POST');
})

// This responds a DELETE request for the /del_user page.
app.delete('/del_user', function (req, res) {
   console.log("Got a DELETE request for /del_user");
   res.send('Hello DELETE');
})

// This responds a GET request for the /list_user page.
app.get('/list_user', function (req, res) {
   console.log("Got a GET request for /list_user");
   res.send('Page Listing');
})

// This responds a GET request for abcd, abxcd, ab123cd, and so on
app.get('/ab*cd', function(req, res) {   
   console.log("Got a GET request for /ab*cd");
   res.send('Page Pattern Match');
})
*/

app.use(express.static('public'));
app.get('/index.html', function (req, res) {
   res.sendFile( __dirname + "/" + "index.html" );
})

/*app.get('/process_get', function (req, res) {
   // Prepare output in JSON format
   response = {
      first_name:req.query.first_name,
      last_name:req.query.last_name
   };
   console.log(req.body);
   res.end(JSON.stringify(req.query.first_name));
})*/

let database=[
    {id:1,titolo:'Pinocchio',autore:'Carlo Collodi',tipologia:'storia per ragazzi',npag:140,voto:8},
    {id:2,titolo:'Harry Potter',autore:'J.K. Rowling',tipologia:'Fantasy',npag:250,voto:9},
    {id:3,titolo:'Attack on Titan',autore:'Hajime Isayama',tipologia:'Manga',npag:150,voto:9},
];

app.get('/allBooks', function(req,res){
    res.end(JSON.stringify(database));
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/addLibro', function(req,res){
   var newLibro=req.body;
   database.push(newLibro);
});

app.get('/recieveLibro', function(req,res){
   for(let a of database){
      if(a.id==req.query.id){
         res.send(JSON.stringify(a));
      }
   }
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})