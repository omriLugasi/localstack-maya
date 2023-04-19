import Route from 'express'
import s3Module from './../../aws/modules/S3'
import fileRouter from './files'

const route = Route()


route.get('/', async (req, res) => {
    try {
        const { Buckets } = await s3Module.listBuckets()
        res.send({ Items: Buckets })
    } catch(e) {
        console.error(e)
        res.send({ items: [] })
    }
})

route.post('/', async (req, res) => {
    try {
        const response = await s3Module.createBucket({
            bucketName: req.body.BucketName,
            isVersioned: req.body.IsVersioned
        })
        res.send({ Response: response })
    } catch(e) {
        console.error(e)
        res.status(400).json(e.message)
    }
})

route.use('/files', fileRouter)


export default route
