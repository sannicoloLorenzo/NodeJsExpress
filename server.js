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
//prende i dati all'interno del file dbBibblioteca.json
const database=require("./dbBibblioteca.json");
const utenti=require("./dbUtenti.json");
//ritorna tutti i libri del db
app.get('/allBooks', function(req,res){
    res.send(JSON.stringify(database));
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//inserisce un nuovo libro nel db
app.post('/addLibro', function(req,res){
   var newLibro=req.body;
   database.push(newLibro);
});
//richiesta per restituire uno specifico libro da id
app.get('/recieveLibro', function(req,res){
   for(let a of database){
      if(a.id==req.query.id){
         res.send(JSON.stringify(a));
      }
   }
});
//elimina il libro il cui id è passato dalla richiesta
app.delete('/deleteLibro', function(req,res){
   for(let i=0;i<database.length;i++){
      if(database[i].id==req.query.id){
         database.splice(i,1);
      }
   }
})
//aggiorna un libro
app.put('/putLibro',function(req,res){
   var updateLibro=req.body;
   for(let i=0;i<database.length;i++){
      if(database[i].id==updateLibro.id){
         database[i]=updateLibro;
      }
   }
})
//restituisce una lista di libri conl'inzio del titolo uguale al campo titolo
//nella richiesta - la ricerca non è case sensitive
app.get('/findLibro',function(req,res){
   let listaRicerca=[];
   let titolo=req.query.titolo.toLowerCase();
   for(let a of database){
      let newA=a.titolo.toLowerCase();
      if(!newA.indexOf(titolo))
         listaRicerca.push(a);
   }
   res.send(JSON.stringify(listaRicerca));
})
//restituisce la lista di tutti i libri che hanno la tipologia uguale a quella
//presente nella richiesta - la ricerca non è case sensitive
app.get('/findTipologia',function(req,res){
   let listaRicerca=[];
   let tipologia=req.query.tipologia.toLocaleLowerCase();
   for(let a of database){
      let newA=a.tipologia.toLowerCase();
      if(!newA.indexOf(tipologia))
         listaRicerca.push(a);
   }
   res.send(JSON.stringify(listaRicerca));
})
//ritorna tutti i libri con disponibilità = true
app.get('/dispo',function(req,res){
   let listaDisp=[];
   for(let a of database){
      if(a.disp==true)
         listaDisp.push(a);
   }
   res.send(JSON.stringify(listaDisp));
})

app.get('/login',function(req,res){
   for(let a of utenti){
      if(a.nome==req.query.nome&&a.password==req.query.password){
         res.send(JSON.stringify(a));
      }
   }
})
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})