import express from 'express'
import cors from 'cors'
import sqsRoute from './routes/sqs'

const app = express()

app.use(express.json())

app.use(cors())

app.use('/sqs', sqsRoute)

app.listen(3232, () => {
    console.log('The server opened on port 3232')
})

