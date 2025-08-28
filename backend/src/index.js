import { app } from './app.js';
import { connectDb } from './db/index.js'
import dotenv from 'dotenv'

dotenv.config()

connectDb()
.then(()=>{

    console.log('db connected successfully')

    const port = process.env.PORT || port

    app.listen(port, ()=>{
        console.log(`server started on port ${port}`)
    })

})
.catch((err)=>{
    console.log(err)
    process.exit(1)
})
