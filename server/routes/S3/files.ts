import Route from 'express'
import s3Module from './../../aws/modules/S3'

const route = Route()


route.get('/', async (req, res) => {
    try {
        const response = await s3Module.listObjectsV2(req.query)
        res.send(response)
    } catch(e) {
        console.error(e)
        res.status(400).json(e.message)
    }
})


route.post('/', async (req, res) => {
    try {
        const params = {
            Bucket: req.body.BucketName,
            Body: req.files.File.data,
            Key: req.body.Path,
            ContentType: req.files.File.mimeType,
            ContentLength: req.files.File.size
        }
        const response = await s3Module.uploadFile(params)
        res.send(response)
    } catch(e) {
        console.error(e)
        res.status(400).json(e.message)
    }
})

route.post('/dynamic', async (req, res) => {
    const { S3Method, S3Attribute } = req.body
    try {
        const response = await s3Module.getS3()[S3Method](S3Attribute).promise()
        res.send(response)
    } catch (e) {
        res.status(400).json(e.message)
    }
})

export default route
