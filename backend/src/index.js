import express from 'express'
import dotenv from 'dotenv'

dotenv.config()

const app = express()


app.get('/',(req, res)=>{

    const ip = req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket.remoteAddress

    console.log(ip)

    res.send(ip)

})

const port = process.env.PORT || 8000

app.listen(port, ()=>{
    console.log('server started at port');
})