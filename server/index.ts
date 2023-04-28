import express from 'express'
import cors from 'cors'
import axios from 'axios'
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

app.use('/dynamic/*', async (req, res) => {
    const url = `http://localhost:4566${req.originalUrl.replace('/dynamic', '')}`
    try {
        if (req.method.toLowerCase() === 'get') {
            const response = axios[req.method](url, { params: req.query })
            res.send(response.data)
        }
        console.log(url, req.method, req.headers)
        const response = await axios[req.method.toLowerCase()](url,
            !!Object.keys(req.body).length ? req.body : undefined, {
            headers: {
                authorization: req.headers.authorization,
                'content-type': req.headers['content-type'],
                'accept-encoding': 'gzip, deflate, br',
                'x-amz-content-sha256': 'a4a3d263179bfcbaf88755b14ea9db3048e4179c03bbc94ccf0f13c8c2d3df6a',
                'x-amz-user-agent': 'aws-sdk-js/2.1366.0 promise',
                'x-amz-date': '20230427T161750Z',
                // 'content-length': req.headers['content-length'],

            }
        })
        console.log(response)
        res.send(response.data)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
})

app.listen(3232, () => {
    console.log('The server opened on port 3232')
})

