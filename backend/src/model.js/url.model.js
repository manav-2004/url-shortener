import mongoose from 'mongoose'

const schema = new mongoose.Schema({

    shortUrl : {
        type : String,
        required : true
    },
    originalUrl : {
        type : String,
        required : true        
    }
})


export const URI = mongoose.model('URI', schema)