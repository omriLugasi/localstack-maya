import express from 'express'
import sqsRoute from './routes/sqs'

const app = express()

app.use(express.json())

app.use('/sqs', sqsRoute)

app.listen(3232, () => {
    console.log('The server opened on port 3232')
})

