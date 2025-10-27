import express from 'express'
import 'dotenv/config'
import youtubeRouter from './routes/youtube.route.js'
import userRoute from './routes/user.routes.js'
import payment from './routes/paymentRoute.js'
import { connectDB } from './db/database.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()
const port = 3000

app.use(cors({
  origin: ['https://title-forge.vercel.app','http://localhost:5173'],
  credentials: true,
}));
app.set('trust proxy', true);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/api/youtube', youtubeRouter)
app.use('/api/user', userRoute)
app.use('/api/payment', payment)
app.get('/', (req, res) => {
  res.send('Hello World!')
})

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
})
