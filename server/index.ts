import express from 'express'
import cors from 'cors'
import axios from 'axios'
import fileUpload from 'express-fileupload'

const app = express()

app.use(express.raw({ limit: '50mb', inflate:true, type: '*/*' }))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}))

app.use(cors())

app.use(['/dynamic/*', '/dynamic'], async (req, res) => {
    const url = `http://localhost:4566${req.originalUrl.replace('/dynamic', '')}`
    try {
        if (req.method.toLowerCase() === 'get') {
            const response = await axios[req.method.toLowerCase()](url, {
                params: req.query,
                headers: {
                    ...req.headers,
                }
            })
            res.send(response.data)
            return
        }
        if (req.headers['content-type'] === 'application/octet-stream') {
            const response = await axios[req.method.toLowerCase()](url, req.body, {
                    headers: {
                        ...req.headers,
                    }
                })
            res.send(response.data)
            return
        }
        const response = await axios[req.method.toLowerCase()](url,
            !!Object.keys(req.body).length ? req.body : undefined, {
            headers: {
                ...req.headers,
            }
        })
        res.send(response.data)
    } catch (e) {
        console.log(e.response)
        res.status(e.response.status).json(e)
    }
})

app.listen(3232, () => {
    console.log('The server opened on port 3232')
})

