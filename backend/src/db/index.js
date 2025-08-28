import mongoose from 'mongoose'

export const connectDb = async ()=>{
    try {
        
        await mongoose.connect(process.env.DB_URL)
    } catch (error) {
        throw error
    }
}