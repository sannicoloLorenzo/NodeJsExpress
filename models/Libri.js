const mongoose = require('mongoose')

const LibroSchema=new mongoose.Schema({
    id:Number,
    titolo:String,
    autore:String,
    tipologia:String,
    npag:Number,
    voto:Number,
    disp:Boolean
})

const Libro=mongoose.model('Libro',LibroSchema);

module.exports=Libro;