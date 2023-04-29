import express from 'express'
import cors from 'cors'
import axios from 'axios'
import sqsRoute from './routes/sqs'
import fileUpload from 'express-fileupload'

const app = express()

app.use(express.raw({ limit: '50mb', inflate:true, type: '*/*' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))

app.use(cors())

app.use('/sqs', sqsRoute)

app.use('/dynamic/*', async (req, res) => {
    const url = `http://localhost:4566${req.originalUrl.replace('/dynamic', '')}`
    try {
        if (req.method.toLowerCase() === 'get') {
            const response = await axios[req.method.toLowerCase()](url, {
                params: req.query,
                headers: {
                    authorization: req.headers.authorization,
                    Accept: 'application/json',
                    'content-type': req.headers['content-type'],
                    'accept-encoding': 'gzip, deflate, br',
                    'x-amz-content-sha256': req.headers['x-Amz-Content-Sha256'],
                    'X-Amz-Date': req.headers['x-Amz-Date'],
                    'x-amz-user-agent': 'aws-sdk-js/2.1366.0 promise',
                }
            })
            res.send(response.data)
            return
        }
        if (req.headers['content-type'] === 'application/octet-stream') {
            const response = await axios[req.method.toLowerCase()](url, req.body, {
                    headers: {
                        authorization: req.headers.authorization,
                        'content-type': req.headers['content-type'],
                        'accept-encoding': 'gzip, deflate, br',
                        'x-amz-content-sha256': req.headers['x-Amz-Content-Sha256'],
                        'X-Amz-Date': req.headers['x-Amz-Date'],
                        'x-amz-user-agent': 'aws-sdk-js/2.1366.0 promise',
                    }
                })
            res.send(response.data)
            return
        }
        const response = await axios[req.method.toLowerCase()](url,
            !!Object.keys(req.body).length ? req.body : undefined, {
            headers: {
                authorization: req.headers.authorization,
                'content-type': req.headers['content-type'],
                'accept-encoding': 'gzip, deflate, br',
                'x-amz-content-sha256': req.headers['x-Amz-Content-Sha256'],
                'X-Amz-Date': req.headers['x-Amz-Date'],
                'x-amz-user-agent': 'aws-sdk-js/2.1366.0 promise',
            }
        })
        res.send(response.data)
    } catch (e) {
        console.log(e)
        res.status(400).json(e)
    }
})

app.listen(3232, () => {
    console.log('The server opened on port 3232')
})

