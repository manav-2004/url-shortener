import express from 'express'
import cors from 'cors'

const app = express()


app.use(express.json())


app.use(cors({
    origin : process.env.ORIGIN || 'http://localhost:5173',
    credentials : true
}))


import routes from './routes/user.routes.js'
import { redirect } from './controllers/user.controllers.js'

app.use('/api/v1/user', routes)

app.router.get('/:shortUrl', redirect)

export {
    app
}