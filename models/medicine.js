var mongoose=require('mongoose')

schema=new mongoose.Schema({name:String,category:String,instock:String,price:Number})

module.exports=mongoose.model('medicine',schema)