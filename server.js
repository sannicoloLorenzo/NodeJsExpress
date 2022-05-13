var express = require('express');
const mongoose = require('mongoose');
var cors = require('cors');
const Libro = require('./models/Libri.js')
const User=require('./models/Utenti.js')
const bodyParser = require('body-parser');
var app = express();
var PORT=3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

//connessione al database mongodb
mongoose.connect('mongodb+srv://lorenzo:root@nodeexpress.p28zm.mongodb.net/dbLibreriaLibri?retryWrites=true&w=majority')
.then(()=>{
    app.listen(PORT, ()=>{
        console.log("Database connection is Ready "
        + "and Server is Listening on Port ", PORT);
    })
})
.catch((err)=>{
    console.log("A error has been occurred while"
        + " connecting to database.");   
})

//prende i dati all'interno del file dbBibblioteca.json
const prenotazioni=require("./dbPrenotazioni.json");
//ritorna tutti i libri del db
app.get('/allBooks', (req, res) =>{    
   Libro.find({})
       .then(user => {       
          if(!user) {       
             res.status(404).send();      
          }
          res.send(user);
        }).catch((e) => {      
           res.status(400).send(e);    
        });
});

//inserisce un nuovo libro nel db
app.post('/addLibro', (req, res) => {
   var newLibro = new Libro({
      id:req.body.id,
      titolo:req.body.titolo,
      autore:req.body.autore,
      tipologia:req.body.tipologia,
      npag:req.body.npag,
      voto:req.body.voto,
      disp:req.body.disp
   });
   newLibro.save().then(user => {
       res.send(user);
   }, (e) => {
       res.status(400).send(e);
   });
});

//richiesta per restituire uno specifico libro da id
app.get('/recieveLibro', (req, res) => {     
   Libro.findOne({id: req.query.id})
       .then(user => {       
          if(!user) {       
            res.status(404).send();      
          }
          res.send(user);
       }).catch((e) => {      
            res.status(400).send(e);    
       });
});

//elimina il libro il cui id è passato dalla richiesta
app.delete('/deleteLibro', (req, res) => {   
   Libro.findOneAndRemove({id: req.query.id})
       .then((user) => {
          if(!user) {           
             res.status(404).send();        
          }          
          res.send(user);
       }).catch((e) => {          
          res.status(400).send(e);
       });
});

//aggiorna un libro
app.patch('/putLibro', (req, res) => {     
   Libro.findOne({id: req.body.id})
     .then(user => {
       // new values
       user.titolo= req.body.titolo;
       user.autore= req.body.autore;
       user.tipologia= req.body.tipologia;
       user.npag= req.body.npag;
       user.voto= req.body.voto;
       user.save()
      .then(user => {
         res.send(user);
       }).catch((e) => {        
            res.status(400).send(e);      
       })
   });
 });

//restituisce una lista di libri conl'inzio del titolo uguale al campo titolo
//nella richiesta - la ricerca non è case sensitive
app.get('/findLibro', (req, res) => {
   let titolo=req.query.titolo.toLowerCase();
   Libro.find({})
       .then(user => {       
          if(!user) {       
            res.status(404).send();      
          }
          newuser=[]
          for(let i=0;i<user.length;i++){
             let titA=user[i].titolo.toLowerCase();
             if(!titA.indexOf(titolo))
               newuser.push(user[i])
          }
          res.send(newuser);
       }).catch((e) => {      
            res.status(400).send(e);    
       });
});

//restituisce la lista di tutti i libri che hanno la tipologia uguale a quella
//presente nella richiesta - la ricerca non è case sensitive
app.get('/findTipologia', (req, res) => {
   let tipo=req.query.tipologia.toLowerCase();
   Libro.find({})
       .then(user => {       
          if(!user) {       
            res.status(404).send();      
          }
          newuser=[]
          for(let i=0;i<user.length;i++){
             let tipA=user[i].tipologia.toLowerCase();
             if(!tipA.indexOf(tipo))
               newuser.push(user[i])
          }
          res.send(newuser);
       }).catch((e) => {      
            res.status(400).send(e);    
       });
});

//ritorna tutti i libri con disponibilità = true
app.get('/dispo', (req, res) => {
   Libro.find({})
       .then(user => {       
          if(!user) {       
            res.status(404).send();      
          }
          newuser=[]
          for(let i=0;i<user.length;i++){
            if(user[i].disp)
               newuser.push(user[i])
          }
          res.send(newuser);
       }).catch((e) => {      
            res.status(400).send(e);    
       });
});

app.get('/findAutore', (req, res) => {
   let aut=req.query.autore.toLowerCase();
   Libro.find({})
       .then(user => {       
          if(!user) {       
            res.status(404).send();      
          }
          newuser=[]
          for(let i=0;i<user.length;i++){
             let autA=user[i].autore.toLowerCase();
             if(!autA.indexOf(aut))
               newuser.push(user[i])
          }
          res.send(newuser);
       }).catch((e) => {      
            res.status(400).send(e);    
       });
});

/*
app.get('/prenota',function(req,res){
   libro=req.query.id;
   user=req.query.user;
   for(let utente of prenotazioni){
      if(utente.nome==user){
         for(let a of database){
            if(a.id==libro){
               a.disp=false;
               utente.prenotazioni.push(a);
            }
         }
      }
   }
})

app.get('/visualizzaPrenotazioni',function(req,res){
   let risp;
   let user=req.query.nome;
   for(let a of prenotazioni){
      if(a.nome==user)
         risp=a.prenotazioni;
   }
   res.send(JSON.stringify(risp));
})

app.get('/restituisci',function(req,res){
   libro=req.query.id;
   user=req.query.user;
   for(let y=0;y<prenotazioni.length;y++){
      if(prenotazioni[y].nome==user){
         for(let i=0;i<prenotazioni[y].prenotazioni.length;i++){
            if(prenotazioni[y].prenotazioni[i].id==libro){
               prenotazioni[y].prenotazioni[i].disp=true;
               prenotazioni[y].prenotazioni.splice(i,1);
            }
         }
      }
   }
})

app.get('/noleggiato',function(req,res){
   let risp=false;
   let libro=req.query.id;
   let user=req.query.nome;
   for(let a of prenotazioni){
      if(a.nome==user){
         for(let i=0;i<a.prenotazioni.length;i++){
            if(a.prenotazioni[i].id==libro)
               risp=true;
         }
      }
   }
   res.send(JSON.stringify(risp));
})
*/
//--------------------| GESTIONE UTENTI |--------------------

//ritorna l'utente presente nel database se esistente, altrimenti torna null
app.get('/login', (req, res) => {     
   User.findOne({nome: req.query.nome})
       .then(user => {       
          if(!user) {       
            res.send(null);      
          }else if(user.password==req.query.password)
         {res.send(user);}
         else{res.send(null);}
       }).catch((e) => {      
            res.status(400).send(e);    
       });
});

//aggiunge un utente al database
app.post('/addUser', (req, res) => {
   var newUser = new User({
      nome:req.body.nome,
      password:req.body.password,
      role:req.body.role
   });
   newUser.save().then(user => {
       res.send(user);
   }, (e) => {
       res.status(400).send(e);
   });
});

//restituisce tutti glii utenti presenti nel database
app.get('/allUser', (req, res) =>{    
   User.find({})
       .then(user => {       
          if(!user) {       
             res.status(404).send();      
          }
          res.send(user);
        }).catch((e) => {      
           res.status(400).send(e);    
        });
});

//restituisce l'utente cercato
app.get('/getUser', (req, res) => {     
   User.findOne({nome: req.query.nome})
       .then(user => {       
          if(!user) {       
            res.status(404).send();        
          }
          res.send(user);
       }).catch((e) => {      
            res.status(400).send(e);    
       });
});

//rimuove l'utente dal database
app.delete('/delUser', (req, res) => {   
   User.findOneAndRemove({nome: req.query.nome})
       .then((user) => {
          if(!user) {           
             res.status(404).send();        
          }          
          res.send(user);
       }).catch((e) => {          
          res.status(400).send(e);
       });
});

//modifica il ruolo di un utente
app.patch('/updateRole', (req, res) => {     
   User.findOne({nome: req.body.nome})
     .then(user => {
       // new values
       user.role= req.body.role;
       user.save()
      .then(user => {
         res.send(user);
       }).catch((e) => {        
            res.status(400).send(e);      
       })
   });
 });

//modifica la password dell'utente
app.patch('/updatePassword', (req, res) => {     
   User.findOne({nome: req.body.nome})
     .then(user => {
       // new values
       user.password= req.body.password;
       user.save()
      .then(user => {
         res.send(user);
       }).catch((e) => {        
            res.status(400).send(e);      
       })
   });
 });

 //torna la password dell'utente
 /*app.get('/getPassword', (req, res) => {     
   User.findOne({nome: req.query.nome})
       .then(user => {       
          if(!user) {       
            res.status(404).send();        
          }
          pass=user.password
          res.send(pass);
       }).catch((e) => {
            res.status(400).send(e);
       });
});*/

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})