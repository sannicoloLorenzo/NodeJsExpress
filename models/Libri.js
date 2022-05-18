const mongoose = require('mongoose')

const LibroSchema=new mongoose.Schema({
    id:Number,
    titolo:String,
    autore:String,
    tipologia:String,
    npag:Number,
    voto:Number,
    disp:Boolean,
    //dislocazione è una stringa formata da tre caratteri, il primo rappresentante la sala(Char) dove è presente 
    //li libro, il secondo rappresenta la libreria(Number) dove trovarlo ed il terzo lo scaffale(Char)
    dislocazione:String
})

const Libro=mongoose.model('Libro',LibroSchema);

module.exports=Libro;