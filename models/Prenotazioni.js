const mongoose = require('mongoose')

const PrenSchema=new mongoose.Schema({
    nome:String,
    libri:[],
    date:[]
})

const Pren=mongoose.model('Prenotazioni',PrenSchema);

module.exports=Pren;