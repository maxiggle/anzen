import express from 'express'
import cors from 'cors'

import router from './router'
import { errorHandler } from './middlewares/errorHandler'
import notFoundHandler from './middlewares/notFoundHandler'

const app = express()


app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', router)

app.use(errorHandler)
app.use(notFoundHandler)


export default app;