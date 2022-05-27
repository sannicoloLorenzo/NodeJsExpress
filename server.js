var express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
var cors = require('cors');
const Libro = require('./models/Libri.js')
const User=require('./models/Utenti.js')
const Pren=require('./models/Prenotazioni.js')
const transporter=require('./email.js')
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
      disp:req.body.disp,
      dislocazione:req.body.dislocazione
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
       user.dislocazione=req.body.dislocazione;
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

//restituisce la lista di tutti i libri che hanno l'autore uguale a quella
//presente nella richiesta - la ricerca non è case sensitive
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

//restituisce i libri che si trovano nella dislocazione cercata
app.get('/trovaBiblioteca',(req,res)=>{
   Libro.find({})
      .then(book=>{
         if(!book)
            res.status(404).send();
         libriTrovati=[]
         for(let i=0;i<book.length;i++){
            if(!book[i].dislocazione.indexOf(req.query.dislocazione))
               libriTrovati.push(book[i]);
         }
         res.send(libriTrovati);
      }).catch((e) => {
         res.status(400).send(e);
      });
})

//prenota un libro
app.post('/prenota', (req, res) => {
   let pren=[]
   let startLend=new Date();
   let diff=startLend.getDate()+7;
   let endLend=new Date();
   endLend.setDate(diff)
   Pren.findOne({nome:req.query.nome})
   .then(user=>{
      if(user){
         Libro.findOne({id:req.body.id})
         .then(book=>{
            if(book){
               book.disp=false;
               user.libri.push(book);
               pren.push(book.id,startLend,endLend);
               user.date.push(pren);
               book.save();
               user.save();
            }
         })
      }
      res.send(user);
   }).catch((e) => {      
         res.status(400).send(e);    
   });
});

//visualizza libri prenotati
app.get('/visualizzaPrenotazioni',function(req,res){
   Pren.findOne({nome:req.query.nome})
   .then(user=>{
      res.send(user.libri);
   }).catch((e) => {      
      res.status(400).send(e);
   });
});

//restituisce un libro
app.patch('/restituisci',function(req,res){
   Pren.findOne({nome:req.query.nome})
   .then(user=>{
      if(!user)
         res.status(404).send()
      else{
      for(let i=0;i<user.libri.length;i++){
         if(user.libri[i].id==req.body.id){
            user.libri.splice(i,1);
            for(let y=0;y<user.date.length;i++){
               if(user.date[i][0]==req.body.id)
                  user.date.splice(y,1);
            }
            Libro.findOne({id:req.body.id})
            .then(book=>{
               if(!book)
                  res.status(404).send()
               book.disp=true;
               book.save()
            })
         }
      }
      user.save()
   }
   }).catch((e) => {      
      res.status(400).send(e);    
   });
});

//controlla se un libro è noleggiato da un determinato utente
app.get('/noleggiato',function(req,res){
   let risp=false;
   Pren.findOne({nome:req.query.nome})
   .then(user=>{
      if(!user)
         res.status(404).send()
      else{
      for(let a of user.libri){
         if(a.id==req.query.id)
            risp=true;
      }
      res.send(risp);
      }
   }).catch((e) => {      
      res.status(400).send(e);    
   });
})

//ritorna le date del inizio prestito di un libro
app.get('/date',function(req,res){
   Pren.findOne({nome:req.query.nome})
   .then(user=>{
      if(!user)
         res.status(404).send()
      else{
      for(let a of user.date){
         if(a[0]==req.query.id){
            res.send(a[1]);
        }
      }
      }
   }).catch((e) => {      
      res.status(400).send(e);    
   });
})

//ritorna le date del termine prestito di un libro
app.get('/endDate',function(req,res){
   Pren.findOne({nome:req.query.nome})
   .then(user=>{
      if(!user)
         res.status(404).send()
      else{
      for(let a of user.date){
         if(a[0]==req.query.id){
            res.send(a[2]);
        }
      }
      }
   }).catch((e) => {      
      res.status(400).send(e);    
   });
})

//aggiunge un record al database prenotazioni
nuovaPren=function(nome){
   newPren= new Pren({
      nome:nome,
      libri:[],
      date:[]
   })
   newPren.save();
}

//rimuove un record al database prenotazioni e imposta la disponibilità di tutti i libri
//del record a true
rimuoviPren=function(nome){
   Pren.findOneAndRemove({nome:nome})
   .then(user=>{
      for(let a of user.libri){
         Libro.findOne({id:a.id})
         .then(book=>{
            if(book){
               book.disp=true;
               book.save()
            }
         })
      }
   })
}
//reitorna tutte le date di scadenza dell'utente scelto
app.get('/allDate',function(req,res){
   Pren.findOne({nome:req.query.nome})
   .then(user=>{
      if(!user){
         res.status(404).send();
      }else{
         let allDate=[]
         for(let i=0;i<user.date.length;i++){
            let newA=[user.date[i][0],(Number)(user.date[i][1].getDate())+'-'+(Number)(user.date[i][1].getMonth())
            ,(Number)(user.date[i][2].getDate())+'-'+(Number)(user.date[i][2].getMonth())]
            allDate.push(newA)
         }
         res.send(allDate);
      }
   }).catch((e) => {      
      res.status(400).send(e);    
   });
})
//richiesta per inviare la mail
app.get('/sendMail',(req,res)=>{
   email();
   res.send('mail inviata');
})

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
   nuovaPren(req.body.nome);
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
          rimuoviPren(req.query.nome);         
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

//metodo per inviare mail tramite nodemailer
email=function(){
   message = {
      from: '"Biblioteca" <biblioteca.lorenzo31@gmail.com>',
      to: "biblioteca.lorenzo31@gmail.com",
      subject: "Bibblioteca - Libro in scadenza",
      text: "Buongiorno,\nla informiamo che uno dei libri da lei prenotati è prossimo alla scadenza.\nLa preghiamo di rispettare le date di consegna prestabilite e le auguriamo una buon proseguimento di giornata.\nBibblioteca"
   }
   transporter.sendMail(message, (err, info)=>{
      if (err) {
        console.log(err)
      } else {
        console.log(info);
      }
   })
}

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})