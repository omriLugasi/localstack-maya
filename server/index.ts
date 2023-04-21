import express from 'express'
import cors from 'cors'
import sqsRoute from './routes/sqs'
import s3Route from './routes/S3'
import fileUpload from 'express-fileupload'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))

app.use(cors())

app.use('/sqs', sqsRoute)
app.use('/s3', s3Route)

app.listen(3232, () => {
    console.log('The server opened on port 3232')
})

